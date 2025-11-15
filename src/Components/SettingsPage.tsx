

import React, { useState, useEffect, useRef } from "react";
import { FaUser } from 'react-icons/fa';
import "./SettingsPage.css";
import { useLanguage } from '../LanguageContext';
import { useTranslation } from '../i18n';

const OPTIONS = [
    { id: 'profile', label: 'Profile' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'language', label: 'Language' },
    { id: 'security', label: 'Security' },
];

const SettingsPage: React.FC = () => {
    const [active, setActive] = useState<string>('profile');

    const [profileName, setProfileName] = useState<string>('Usuário');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [tempName, setTempName] = useState<string>('');
    const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);
    const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

    // theme state (moved to top-level to follow Hooks rules)
    const [theme, setTheme] = useState<string>(() => {
        try { return localStorage.getItem('app_theme') || 'dark'; } catch (err) { return 'dark'; }
    });

    // security state: email and password (local-only persistence)
    const [securityEmail, setSecurityEmail] = useState<string>('');
    const [securityPassword, setSecurityPassword] = useState<string>('');
    const [securityPasswordConfirm, setSecurityPasswordConfirm] = useState<string>('');
    // language selection (UI only for now) — driven by LanguageContext (first incremental step)
    const { language, setLanguage: setAppLanguage } = useLanguage();
    const { t } = useTranslation();

    const applyTheme = (v: string) => {
        try { localStorage.setItem('app_theme', v); } catch (err) {}
        if (v === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', v);
        }
    };

    useEffect(() => {
        applyTheme(theme);
    }, []); // apply once on mount

    useEffect(() => {
        try {
            const raw = localStorage.getItem('app_user_profile');
            if (raw) {
                const obj = JSON.parse(raw);
                if (obj?.name) setProfileName(obj.name);
                if (obj?.avatarUrl) setAvatarUrl(obj.avatarUrl);
            }
        } catch (err) {
            console.warn('Falha ao carregar perfil local', err);
        }
    }, []);

    // load security info (if previously saved locally)
    useEffect(() => {
        try {
            const raw = localStorage.getItem('app_security');
            if (raw) {
                const obj = JSON.parse(raw);
                if (obj?.email) setSecurityEmail(obj.email);
                // we don't auto-fill password for security reasons
            }
        } catch (err) {
            // ignore
        }
    }, []);

    const persistProfile = (name: string, avatar: string | null) => {
        try {
            localStorage.setItem('app_user_profile', JSON.stringify({ name, avatarUrl: avatar }));
            setProfileName(name);
            setAvatarUrl(avatar);
        } catch (err) {
            console.warn('Erro ao salvar profile local', err);
        }
    };

    const onChooseFile = (file?: File) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (!allowed.includes(file.type)) {
            alert('Formato inválido. Use JPG, PNG ou WEBP.');
            return;
        }
        if (file.size > maxSize) {
            alert('Arquivo muito grande. Limite: 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string | null;
            if (result) setTempAvatarUrl(result);
        };
        reader.onerror = () => {
            alert('Erro ao processar a imagem.');
        };
        reader.readAsDataURL(file);
    };

    // remove photo immediately and persist change
    const removePhoto = () => {
        setTempAvatarUrl(null);
        setAvatarUrl(null);
        try {
            persistProfile(profileName, null);
            try { window.dispatchEvent(new CustomEvent('profile:changed', { detail: { name: profileName, avatarUrl: null } })); } catch (e) {}
        } catch (err) { /* ignore */ }
    };

    const saveSecurity = () => {
        // basic validation
        const email = securityEmail?.trim();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            alert('Digite um email válido.');
            return;
        }
        if (securityPassword) {
            if (securityPassword.length < 6) {
                alert('Senha muito curta (mínimo 6 caracteres).');
                return;
            }
            if (securityPassword !== securityPasswordConfirm) {
                alert('As senhas não coincidem.');
                return;
            }
        }

        try {
            const payload: any = { email };
            if (securityPassword) payload.password = securityPassword; // local demo only
            localStorage.setItem('app_security', JSON.stringify(payload));
            setSecurityPassword('');
            setSecurityPasswordConfirm('');
            alert('Configurações de segurança salvas localmente.');
        } catch (err) {
            console.warn('Erro ao salvar segurança', err);
            alert('Falha ao salvar.');
        }
    };

    const cancelSecurity = () => {
        // reload stored email
        try {
            const raw = localStorage.getItem('app_security');
            const obj = raw ? JSON.parse(raw) : null;
            setSecurityEmail(obj?.email ?? '');
            setSecurityPassword('');
            setSecurityPasswordConfirm('');
        } catch (err) {
            setSecurityPassword('');
            setSecurityPasswordConfirm('');
        }
    };

    const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) onChooseFile(f);
    };

    const openFilePicker = () => fileRef.current?.click();

    const saveProfile = async () => {
        const nameToSave = tempName?.trim() || profileName;
        const avatarToSave = tempAvatarUrl ?? avatarUrl;
        persistProfile(nameToSave, avatarToSave ?? null);
        setTempAvatarUrl(null);
        setTempName('');

        // if user is authenticated, update login table (user/nome)
        try {
            const rawAuth = localStorage.getItem('app_auth');
            if (rawAuth) {
                const auth = JSON.parse(rawAuth);
                if (auth?.id) {
                    const res = await fetch(`${API_BASE}/api/login/${auth.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user: nameToSave, nome: nameToSave }),
                    });
                    if (res.ok) {
                        const updated = await res.json();
                        try { localStorage.setItem('app_auth', JSON.stringify(updated)); } catch (e) {}
                        // notify header and others
                        try { window.dispatchEvent(new CustomEvent('profile:changed', { detail: { name: updated.nome || updated.user || nameToSave, avatarUrl: avatarToSave ?? null } })); } catch (e) {}
                    } else {
                        // non-fatal: alert user
                        const body = await res.json().catch(() => ({}));
                        alert('Perfil salvo localmente, mas não foi possível atualizar o servidor: ' + (body.message || 'erro'));
                    }
                }
            } else {
                // not authenticated: just dispatch local change
                try { window.dispatchEvent(new CustomEvent('profile:changed', { detail: { name: nameToSave, avatarUrl: avatarToSave ?? null } })); } catch (e) {}
            }
        } catch (err) {
            console.warn('Erro ao sincronizar profile com servidor', err);
        }

        alert('Perfil salvo localmente (localStorage).');
    };

    const cancelChanges = () => {
        setTempAvatarUrl(null);
        setTempName('');
    };

    const renderContent = () => {
        switch (active) {
            case 'profile':
                return (
                    <div className="settings-content profile-settings">
                        <h2>{t('settings.profile.title')}</h2>
                        <div className="profile-grid">
                            <div className="profile-left">
                                <div className="avatar-large-wrap">
                                    { (tempAvatarUrl ?? avatarUrl) ? (
                                        <img src={tempAvatarUrl ?? avatarUrl ?? undefined} alt="Avatar" className="avatar-large" />
                                    ) : (
                                        <div className="avatar-large placeholder"><FaUser size={44} /></div>
                                    ) }
                                </div>
                                <div className="avatar-actions">
                                    <button className="btn small" onClick={openFilePicker}>{t('settings.profile.choosePhoto')}</button>
                                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
                                    {(tempAvatarUrl ?? avatarUrl) ? (
                                        <button className="btn danger small" onClick={removePhoto}>{t('settings.profile.removePhoto')}</button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="profile-right">
                                <label className="settings-label">
                                    {t('settings.profile.nameLabel')}
                                    <input className="settings-input" value={tempName !== '' ? tempName : profileName} onChange={e => setTempName(e.target.value)} />
                                </label>

                                <div className="profile-actions-row">
                                    <button className="btn primary" onClick={saveProfile}>{t('settings.profile.save')}</button>
                                    <button className="btn ghost" onClick={cancelChanges}>{t('buttons.ghost')}</button>
                                </div>

                                <p className="muted">{t('settings.profile.noteLocalSave')}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'appearance':
                return (
                    <div className="settings-content">
                        <h2>Appearance</h2>
                        <label className="settings-label">
                            Tema
                            <select
                                className="settings-select"
                                value={theme}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setTheme(v);
                                    applyTheme(v);
                                }}
                            >
                                <option value="light">Claro</option>
                                <option value="slight-dark">Levemente escuro</option>
                                <option value="dark">Escuro</option>
                            </select>
                        </label>
                        <p className="muted">Escolha entre tema claro, levemente escuro (tons azulados) e escuro.</p>
                    </div>
                );
            case 'language':
                return (
                    <div className="settings-content">
                        <h2>Language</h2>
                        <label className="settings-label">
                            Idioma
                            <select
                                className="settings-select"
                                value={language}
                                onChange={(e) => {
                                        const v = e.target.value as any;
                                        // update global language state — persistence/notifications handled by provider
                                        setAppLanguage(v);
                                    }}
                            >
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (US)</option>
                                <option value="es-ES">Español (ES)</option>
                                <option value="fr-FR">Français (FR)</option>
                                <option value="de-DE">Deutsch (DE)</option>
                            </select>
                        </label>
                        <p className="muted">Selecione o idioma do aplicativo. Esta opção apenas salva a preferência — a tradução será implementada posteriormente.</p>
                    </div>
                );
            case 'security':
                return (
                    <div className="settings-content security-settings">
                        <h2>Security</h2>

                        <div className="security-grid">
                            <div className="security-block security-email">
                                <label className="settings-label">
                                    Email
                                    <input
                                        className="settings-input"
                                        type="email"
                                        value={securityEmail}
                                        onChange={e => setSecurityEmail(e.target.value)}
                                        placeholder="seu@exemplo.com"
                                    />
                                </label>
                                <p className="muted">O email é usado para recuperação e notificações (persistido localmente neste demo).</p>
                            </div>

                            <div className="security-block security-password">
                                <label className="settings-label">
                                    Nova senha
                                    <input
                                        className="settings-input"
                                        type="password"
                                        value={securityPassword}
                                        onChange={e => setSecurityPassword(e.target.value)}
                                        placeholder="Deixe em branco para manter a atual"
                                    />
                                </label>

                                <label className="settings-label">
                                    Confirme a senha
                                    <input
                                        className="settings-input"
                                        type="password"
                                        value={securityPasswordConfirm}
                                        onChange={e => setSecurityPasswordConfirm(e.target.value)}
                                        placeholder="Repita a nova senha"
                                    />
                                </label>

                                <p className="muted">Para alterar a senha, digite duas vezes. Caso contrário, deixe em branco.</p>
                            </div>
                        </div>

                        <div className="profile-actions-row" style={{ marginTop: 12 }}>
                            <button className="btn primary" onClick={saveSecurity}>Salvar</button>
                            <button className="btn ghost" onClick={cancelSecurity}>Cancelar</button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="settings-page-container">
            <div className="settingspage-bg" />
            <div className="settingspage-overlay" />
            <div className="settings-page-card">
                <div className="settings-card-side">
                    <h3>Configurações</h3>
                    <ul className="settings-options">
                        {OPTIONS.map(o => (
                            <li key={o.id} className={"settings-option " + (active === o.id ? 'active' : '')} onClick={() => setActive(o.id)}>
                                {o.label}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="settings-card-main">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
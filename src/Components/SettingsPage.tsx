

import React, { useState, useEffect, useRef } from "react";
import "./SettingsPage.css";

const OPTIONS = [
    { id: 'profile', label: 'Profile' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'security', label: 'Security' },
];

const SettingsPage: React.FC = () => {
    const [active, setActive] = useState<string>('profile');

    const [profileName, setProfileName] = useState<string>('Usuário');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [tempName, setTempName] = useState<string>('');
    const [tempAvatarUrl, setTempAvatarUrl] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement | null>(null);

    // theme state (moved to top-level to follow Hooks rules)
    const [theme, setTheme] = useState<string>(() => {
        try { return localStorage.getItem('app_theme') || 'dark'; } catch (err) { return 'dark'; }
    });

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

    const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) onChooseFile(f);
    };

    const openFilePicker = () => fileRef.current?.click();

    const saveProfile = () => {
        const nameToSave = tempName?.trim() || profileName;
        const avatarToSave = tempAvatarUrl ?? avatarUrl;
        persistProfile(nameToSave, avatarToSave ?? null);
        setTempAvatarUrl(null);
        setTempName('');
        // when backend available, send here
        // notify other parts of the app that profile changed (header should update)
        try {
            window.dispatchEvent(new CustomEvent('profile:changed', { detail: { name: nameToSave, avatarUrl: avatarToSave ?? null } }));
        } catch (err) {
            // ignore
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
                        <h2>Profile</h2>
                        <div className="profile-grid">
                            <div className="profile-left">
                                <div className="avatar-large-wrap">
                                    { (tempAvatarUrl ?? avatarUrl) ? (
                                        <img src={tempAvatarUrl ?? avatarUrl ?? undefined} alt="Avatar" className="avatar-large" />
                                    ) : (
                                        <div className="avatar-large placeholder">U</div>
                                    ) }
                                </div>
                                <div style={{ marginTop: 12 }}>
                                    <button className="btn" onClick={openFilePicker}>Escolher foto</button>
                                    <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
                                </div>
                            </div>

                            <div className="profile-right">
                                <label className="settings-label">
                                    Nome
                                    <input className="settings-input" value={tempName !== '' ? tempName : profileName} onChange={e => setTempName(e.target.value)} />
                                </label>

                                <div className="profile-actions-row">
                                    <button className="btn primary" onClick={saveProfile}>Salvar</button>
                                    <button className="btn ghost" onClick={cancelChanges}>Cancelar</button>
                                </div>

                                <p className="muted">Ao salvar, a alteração ficará disponível localmente. Integrar backend posteriormente.</p>
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
            case 'security':
                return (
                    <div>
                        <h2>Security</h2>
                        <p>Placeholder for password and access control.</p>
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
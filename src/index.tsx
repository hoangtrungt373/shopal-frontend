import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './material/App';
import reportWebVitals from './reportWebVitals';
import i18next from "i18next";
import en from './material/lang/en.json';
import vn from './material/lang/vn.json';
import {I18nextProvider} from 'react-i18next';
import {ProSidebarProvider} from "react-pro-sidebar";


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

export const MultilingualCode = {
    Language: "lan",
    English: "en",
    Vietnamese: "vn"
}

i18next.init({
    interpolation: {escapeValue: false},
    lng: MultilingualCode.Vietnamese,
    resources: {
        en: {
            common: en
        },
        vn: {
            common: vn
        },
    },
});

root.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <ProSidebarProvider>
                <App/>
            </ProSidebarProvider>
        </I18nextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

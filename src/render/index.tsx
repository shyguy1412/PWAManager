import './index.module.css';
import 'normalize.css';
import style from './index.module.css';
import { h, render } from "preact";
import { AddShortcut, Shortcut } from './components/Shortcut';
import { useEffect, useState } from 'preact/hooks';

type Props = {};

function Index({ }: Props) {

    const [shortcuts, setShortcuts] = useState<Record<string, string>>({});

    useEffect(() => {
        window.context_bridge.loadShortcuts().then(shortcuts => setShortcuts(shortcuts));
    }, []);

    return <div class={style.grid}>
        {Object.entries(shortcuts).map(([name, url]) => <Shortcut
            name={name}
            url={url}
            update={async () => {
                setShortcuts(await window.context_bridge.loadShortcuts());
            }}
        ></Shortcut>)}
        <AddShortcut update={async () => {
            setShortcuts(await window.context_bridge.loadShortcuts());
        }}></AddShortcut>
    </div>;
}

console.log('LOADED');

render(<Index></Index>, document.body);


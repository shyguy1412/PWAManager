import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Shortcut.module.css';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { h, Fragment } from 'preact';
import { useEffect, useRef, useState } from 'preact/compat';

export type Props = {
  name: string,
  url: string,
  update: () => void;
};

export function Shortcut({ name, url, update }: Props) {

  let timeout: NodeJS.Timeout;

  const [deleteMode, setDeleteMode] = useState(false);

  if (deleteMode) window.addEventListener('mousedown', () => {
    setDeleteMode(false);
  }, { once: true });

  return deleteMode ?
    <div
      class={style.shortcut}
      onMouseDown={() => { window.context_bridge.removeShortcut(name); update(); }}>
      <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
    </div>
    : <div
      class={style.shortcut}
      style={{
        backgroundImage: `url(https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=256)`
      }}
      onClick={() => {
        window.context_bridge.loadUrl(url);
      }}
      onMouseDown={() => {
        timeout = setTimeout(() => {
          console.log('LONG PRESS');
          setDeleteMode(true);
        }, 1000);
      }}
      onMouseUp={() => {
        clearTimeout(timeout);
      }}
    ></div>;
}

export function AddShortcut({ update }: { update: () => void; }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!form.current) return;

    form.current.addEventListener('submit', async (e) => {
      const [name, url] = [...form.current!.querySelectorAll('input')!].map(el => el.value);
      await window.context_bridge.addShortcut(name, url);
      update();
    });
  }, [form]);

  useEffect(() => {
    if (!dialog.current) return;

    dialog.current.addEventListener('close', () => {
      form.current!.querySelectorAll('input').forEach(el => el.value = '');
    });

  }, [dialog]);

  return <>
    <div class={style.shortcut} onClick={() => dialog.current!.showModal()}>
      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
    </div>
    <dialog ref={dialog}>
      <form ref={form} method="dialog">
        <input required type="text" placeholder="name" />
        <input required type="text" placeholder="url" />
        <button>OK</button>
        <button type="button" onClick={() => dialog.current!.close()}>CANCEL</button>
      </form>
    </dialog>
  </>;
}
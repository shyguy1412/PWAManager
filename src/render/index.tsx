import './index.css';
import 'normalize.css';
import { h, hydrate, render } from "preact";
import { HelloWorld } from "./components/HelloWorld";

type Props = {};

function Index({ }: Props) {
    return <HelloWorld></HelloWorld>
}

console.log('LOADED');

render(<Index></Index>, document.body);


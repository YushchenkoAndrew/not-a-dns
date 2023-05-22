import './App.css';

import NavBar from './components/NavBar/NavBar';
import NavBarItem from './components/NavBar/NavBarItem';

export default function App() {
  return (
    <div className="App">
      {/* <div :class="AppMode[store.mode]"> */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <NavBar name="lets-dns-it">
          {/* TODO: */}
          <NavBarItem name="/mortis-greamreaper" href="home" target="_blank" />
          <NavBarItem name="/grape" href="test" target="_blank" />
          <NavBarItem name="/void" href="t" target="_blank" />
          <NavBarItem name="/botodachi" href="t" target="_blank" />
        </NavBar>
      </div>
    </div>
  );
}

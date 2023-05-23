import './App.css';

import NavBar from './components/NavBar/NavBar';
import NavBarItem from './components/NavBar/NavBarItem';
import SideBar from './components/SideBar/SideBar';
import SideBarChapter from './components/SideBar/SideBarChapter.';
import SideBarItem from './components/SideBar/SideBarItem';
import { isSideBarChapter } from './redux/reducer/sidebar';
import { useAppSelector } from './redux/storage';

export default function App() {
  // TODO: Get faivorites on page load
  const items = {
    navbar: useAppSelector((state) => state.navbar.items),
    sidebar: useAppSelector((state) => state.sidebar.items),
  };

  return (
    <div className="App">
      {/* <div :class="AppMode[store.mode]"> */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <NavBar name="lets-dns-it">
          {items.navbar.map((props, index) => (
            <NavBarItem key={index} {...props} />
          ))}
        </NavBar>

        <div className="flex flex-col sm:flex-row container mx-auto">
          <SideBar>
            {items.sidebar.map((props, index) =>
              isSideBarChapter(props) ? (
                <SideBarChapter key={index} {...props} />
              ) : (
                <SideBarItem key={index} {...props} />
              ),
            )}
          </SideBar>
        </div>

        <footer />
      </div>
    </div>
  );
}

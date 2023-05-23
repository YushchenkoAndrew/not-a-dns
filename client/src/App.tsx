import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

import NavBar from './components/NavBar/NavBar';
import NavBarItem from './components/NavBar/NavBarItem';
import IndexPage from './components/Page/IndexPage';
import SideBar from './components/SideBar/SideBar';
import SideBarChapter from './components/SideBar/SideBarChapter.';
import SideBarItem from './components/SideBar/SideBarItem';
import { generalStore } from './redux/reducer/general';
import { isSideBarChapter } from './redux/reducer/sidebar';
import { useAppDispatch, useAppSelector } from './redux/storage';

library.add(fas);

export default function App() {
  useEffect(() => {
    (async function () {
      const res = await fetch('http://localhost:3000/ping').then((res) =>
        res.text(),
      );
      // .then((text) => console.log(text))
      // .catch((err) => );

      console.log(res);
    })();
    // console.log('HERE');
  }, []);

  // TODO: Get faivorites on page load
  const items = {
    navbar: useAppSelector((state) => state.navbar.items),
    sidebar: useAppSelector((state) => state.sidebar.items),
  };

  const mode = useAppSelector((state) => state.general.mode);

  const dispatch = useAppDispatch();

  return (
    <div className={`App ${!mode.state ? 'dark' : ''}`}>
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

            <SideBarChapter name="settings">
              <SideBarItem name="Modify Record" anchor="" icon="sliders" />

              <SideBarItem
                name=""
                anchor=""
                onClick={() => dispatch(generalStore.actions.invertMode())}
              >
                <div className="group-hover:text-blue-600 dark:group-hover:text-yellow-200">
                  <FontAwesomeIcon
                    icon={mode.icon as any}
                    className="dar mr-3"
                  />
                  {mode.name}
                </div>
              </SideBarItem>
            </SideBarChapter>
          </SideBar>

          <IndexPage />
        </div>
        <footer />
      </div>
    </div>
  );
}

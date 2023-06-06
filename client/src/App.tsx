import 'react-toastify/dist/ReactToastify.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import DefaultIndexPage from './components/default/Page/DefaultIndexPage';
import LoadingScreen from './components/LodingScreen';
import NavBar from './components/NavBar/NavBar';
import NavBarItem from './components/NavBar/NavBarItem';
import { StringService } from './lib';
import { useAppDispatch, useAppSelector } from './redux/storage';
import { preloadGeneral } from './redux/thunk/general.thunk';
import { preloadNavbar } from './redux/thunk/navbar.thunk';

library.add(fas);

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(async () => {
      try {
        await dispatch(preloadNavbar()).unwrap();
        // await dispatch(preloadSidebar()).unwrap();
        await dispatch(preloadGeneral()).unwrap();
      } catch (err) {
        toast(StringService.errToMsg(err), { type: 'error' });
      }
    }, 1000);
  }, []);

  const items = {
    navbar: useAppSelector((state) => state.navbar.items),
    sidebar: useAppSelector((state) => state.sidebar.items),
  };

  const loaded = useAppSelector((state) => state.general.loaded);
  const mode = useAppSelector((state) => state.general.mode);

  return (
    <div className={`App ${!mode.state ? 'dark' : ''}`}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        transition={Bounce}
        closeOnClick
        rtl={false}
        draggable
      />

      {!loaded ? (
        <LoadingScreen />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800">
          <NavBar name="not-a-dns">
            {items.navbar.map((props, index) => (
              <NavBarItem
                key={index}
                name={props.name || props.alias}
                href={props.value}
              />
            ))}
          </NavBar>

          <div className="flex flex-col sm:flex-row container mx-auto">
            {/* <DefaultSideBar>
              {items.sidebar.map((props, index) =>
                isSideBarChapter(props) ? (
                  <SideBarChapter key={index} {...props} />
                ) : (
                  <SideBarItem key={index} {...props} />
                ),
              )}
            </DefaultSideBar> */}

            <DefaultIndexPage />
          </div>
          <footer />
        </div>
      )}
    </div>
  );
}

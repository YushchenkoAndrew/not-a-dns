import 'react-toastify/dist/ReactToastify.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import DefaultSideBar from './components/default/DefaultSideBar';
import DefaultIndexPage from './components/default/Page/DefaultIndexPage';
import LoadingScreen from './components/LodingScreen';
import NavBar from './components/NavBar/NavBar';
import NavBarItem from './components/NavBar/NavBarItem';
import SideBar from './components/SideBar/SideBar';
import SideBarChapter from './components/SideBar/SideBarChapter.';
import SideBarItem from './components/SideBar/SideBarItem';
import { API_URL } from './config';
import { StringService } from './lib';
import { generalStore } from './redux/reducer/general';
import { navbarStore } from './redux/reducer/navbar';
import { isSideBarChapter, sidebarStore } from './redux/reducer/sidebar';
import { useAppDispatch, useAppSelector } from './redux/storage';
import { GeneralSettingResponseDto } from './response-dto/general-setting.response-dto';
import { NavbarSettingResponseDto } from './response-dto/navbar-setting.response-dto';
import { SidebarSettingResponseDto } from './response-dto/sidebar-setting.response-dto';

library.add(fas);

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async function () {
      const navbar = new NavbarSettingResponseDto(
        await fetch(`${API_URL}/setting/navbar`).then((res) => res.json()),
      );

      const sidebar = new SidebarSettingResponseDto(
        await fetch(`${API_URL}/setting/sidebar`).then((res) => res.json()),
      );

      const general = new GeneralSettingResponseDto(
        await fetch(`${API_URL}/setting/general`).then((res) => res.json()),
      );

      await new Promise<void>((resolve) =>
        setTimeout(() => {
          dispatch(navbarStore.actions.init(navbar));
          dispatch(sidebarStore.actions.init(sidebar));
          dispatch(generalStore.actions.init(general));
          resolve();
        }, 2000),
      );
    })().catch((err) => {
      toast(StringService.errToMsg(err), { type: 'error' });
    });
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

              <DefaultSideBar />
            </SideBar>

            <DefaultIndexPage />
          </div>
          <footer />
        </div>
      )}
    </div>
  );
}

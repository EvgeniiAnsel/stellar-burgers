import React, { FC, useEffect } from 'react';
import styles from '../ui/app-header/app-header.module.css';
import { TAppHeaderUIProps } from '../ui/app-header/type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useLocation } from 'react-router-dom';

export const AppHeader: FC<TAppHeaderUIProps> = ({ userName }) => {
  const location = useLocation();
  return (
    <>
      <header className={styles.header}>
        <nav className={`${styles.menu} p-4`}>
          <div className={styles.menu_part_left}>
            <>
              <NavLink
                to='/'
                className={({ isActive }) =>
                  isActive
                    ? `${styles.link} ${styles.link_active}`
                    : ` ${styles.link} `
                }
              >
                {({ isActive }) => (
                  <>
                    <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                    <p className='text text_type_main-default ml-2 mr-10'>
                      Конструктор
                    </p>
                  </>
                )}
              </NavLink>
            </>
            <>
              <NavLink
                to='/feed'
                className={({ isActive }) =>
                  isActive
                    ? `${styles.link} ${styles.link_active}`
                    : ` ${styles.link} `
                }
              >
                {({ isActive }) => (
                  <>
                    <ListIcon type={isActive ? 'primary' : 'secondary'} />
                    <p className='text text_type_main-default ml-2'>
                      Лента заказов
                    </p>
                  </>
                )}
              </NavLink>
            </>
          </div>
          <div className={styles.logo}>
            <Logo className='' />
          </div>
          <div className={styles.link_position_last}>
            <NavLink
              to='/profile'
              className={({ isActive }) =>
                isActive
                  ? `${styles.link} ${styles.link_active}`
                  : ` ${styles.link} `
              }
            >
              {({ isActive }) => (
                <>
                  <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                  <p className='text text_type_main-default ml-2'>
                    {userName || 'Личный кабинет'}
                  </p>
                </>
              )}
            </NavLink>
          </div>
        </nav>
      </header>
    </>
  );
};

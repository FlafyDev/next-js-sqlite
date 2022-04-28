import React, { useEffect, useState, useContext } from 'react';
import styles from './Menu.module.css';
import Link from 'next/link'
import { LoggedContext } from '../../context/loggedContext';

const Menu = (props) => {
	const logged = useContext(LoggedContext);

	const logout = async () => {
		await fetch('api/Users/Logout');
		logged.requestLoggedInfo();
	};

	const menuItems = [
		{ text: 'Home', link: '/' },
		(logged.info.username ? { text: 'Logout', action: logout } : { text: 'Login', link: '/login' }),
		(!logged.info.isAdmin || { text: 'User Manager', link: '/userManager' }),
	];

	return (
		<div className={styles.menu}>
			{
				menuItems.map((item, i) => {
					return <MenuItem text={item.text} link={item.link} action={item.action} key={i} />
				})
			}
			<div className={styles.menuText}>
				{!logged.info.username || `Hello ${logged.info.username}!`}
			</div>
		</div>
	)
}

const MenuItem = (props) => {
	return props.link ? (
		<Link href={props.link}>
			<div className={styles.menuItem}>
				{props.text}
			</div>
		</Link>
	) : (
		props.action ? (
			<div className={styles.menuItem} onClick={props.action}>
				{props.text}
			</div>
		) : <></>
	)
}

export default Menu;
import React, { useEffect, useState } from 'react';
import styles from './UserFilter.module.css';
import StyledInput from '../StyledInput';
import { faSearch } from '@fortawesome/free-solid-svg-icons'

const UserFilter = (props) => {

  useEffect(() => {
    const filteredUsersIndex = 

    props.setSearchQuery(filteredUsersIndex);
  }, [searchQuery]);
}

export default UserFilter;

import React from 'react'
import styles from './StyledInput.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledInput = (props) => {
  return (
    <div hidden={!props.visible}
      className={styles.container}>
      <input
        className={styles.input}
        type={props.type}
        placeholder={props.placeholder} 
        {...(props.inputProps || {})}
        {
          ...(props.state ? { value: props.state[0], onChange: (e) => {
            let newValue = e.target.value;
            if (props.type === 'number') {
              newValue = parseInt(newValue)
            }
            props.state[1](newValue);
          } } : {}) 
        }
      />
      <div className={styles.svgContainer}>
        <FontAwesomeIcon icon={props.icon} />
      </div>
    </div>
  )
}

export default StyledInput;
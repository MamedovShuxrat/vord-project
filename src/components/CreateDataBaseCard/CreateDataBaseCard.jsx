import React from 'react'

import styles from './createDataBaseCard.module.scss'
import SimpleInput from '../Inputs/SimpleInput'

const CreateDataBaseCard = () => {
    return (
        <div className={styles.CardWrapper}>
            <div className={styles.connectMenu}>
                <p className={styles.connectTitle}>Connect by:</p>
                <label className={styles.connectCheckBoxWrapper} htmlFor="connectHost">
                    <input type="checkbox" id='connectHost' name="host" />
                    <span className={styles.connectTitle}>Host</span>
                </label>
                <label className={styles.connectCheckBoxWrapper} htmlFor="connectUrl">
                    <input type="checkbox" id='connectUrl' name="url" />
                    <span className={styles.connectTitle}>URL</span>
                </label>
            </div>
            <form action="/submit" className="formData">
                <SimpleInput placeholder='User' className='dataBaseInput' />
                <SimpleInput placeholder='Password' className='dataBaseInput' />
                <SimpleInput placeholder='Driver' className='dataBaseInput' />
                <SimpleInput placeholder='URL' className='dataBaseInput' />
                <SimpleInput placeholder='Driver' className='dataBaseInput' />
                <div className="hostWrapper">
                    <SimpleInput placeholder='Host' className='dataBaseInput' />
                    <SimpleInput placeholder='Port' className='dataBaseInput' />
                </div>
                <SimpleInput placeholder='Data Base Type' className='dataBaseInput' />
                <SimpleInput placeholder='Data Base' className='dataBaseInput' />
                <SimpleInput placeholder='Description' className='dataBaseInput' />
                <span className="formDataDescr">Connections between VARD and your database will be encrypted</span>
                <button className='formDataBtn'>Connect</button>
            </form>
        </div>
    )
}

export default CreateDataBaseCard
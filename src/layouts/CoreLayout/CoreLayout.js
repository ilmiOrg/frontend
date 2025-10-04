import React from 'react';
import ScrollContainer from '../../components/ui-components/ScrollContainer';
import styles from './CoreLayout.module.css';

function CoreLayout({ children }) {
  return (
    <div className={styles.coreLayout}>
      <ScrollContainer 
        variant="minimal" 
        className={styles.scrollWrapper}
        padding={false}
      >
        {children}
      </ScrollContainer>
    </div>
  );
}

export default CoreLayout;

import React from 'react';
import Reveal from 'react-reveal/Reveal';

import styles from './About.module.scss';

const about = () => {
  return (
    <div className={styles.About}>
      <Reveal>
        <header>
          <h1>ABOUT</h1>
          <h1>SHMACK</h1>
        </header>
        <main>
          <Reveal effect={styles.BlockSlideFadeIn}>
            <p className={styles.SectionTitle}>What is Shmack?</p>
            <p>
              Shmack provides a simple, easy-to-use, and fast user experience
              for viewing and editing food that people eat at restaurants.
            </p>
            <p>
              This app is not for finding the next best restaurant; it is for
              finding the next best <i>food</i> at the restaurant. There is not
              a lot of easily accessible information on what specific items
              people order, but Shmack wants to make that accessible.
            </p>
            <p className={styles.SectionTitle}>How can you help?</p>
            <p>
              The best way to help is adding your favorite foods you have eaten
              at restaurants. The more users contribute to Shmack the more
              useful it is to them.
            </p>
            <p className={styles.SectionTitle}>
              Help others discover the best foods to eat. Thank you!
            </p>
            <p>
              -{' '}
              <a
                href={'https://calvinyhu.com'}
                target="_blank"
                rel="noopener noreferrer"
              >
                Calvin
              </a>
            </p>
          </Reveal>
        </main>
      </Reveal>
    </div>
  );
};

export default about;

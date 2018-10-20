import React from 'react';
import Fade from 'react-reveal';

import styles from './About.module.scss';

const about = () => {
  return (
    <div className={styles.About}>
      <Fade>
        <header>
          <h1>ABOUT</h1>
          <h1>SHMACK</h1>
        </header>
        <main>
          <Fade up>
            <p className={styles.SectionTitle}>What is Shmack?</p>
            <p>
              Shmack provides a simple, easy-to-use, and fast user experience
              for viewing and editing food that people eat at restaurants.
            </p>
            <p className={styles.SectionTitle}>
              How is this different from Yelp, Google, or other food apps?
            </p>
            <p>
              This app is not for finding the next best restaurant; it is for
              finding the next best <i>item</i> at the restaurant. There is not
              a lot of easily accessible data on what specific items people
              order, but Shmack wants to make that data accessible to the users
              who provide that data.
            </p>
            <p className={styles.SectionTitle}>How can you help?</p>
            <p>
              The best way to help is adding your favorite foods you have eaten
              at restaurants. The more users contribute to Shmack the more
              useful it is to them.
            </p>
            <p className={styles.SectionTitle}>
              Please help Shmack grow. Thank you!
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
          </Fade>
        </main>
      </Fade>
    </div>
  );
};

export default about;

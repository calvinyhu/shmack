import React, { Component } from 'react'

import classes from './Home.css'
import Restaurant from '../../components/Restaurant/Restaurant'

class Home extends Component {
    state = {
        isScrollingDown: false,
        restaurants: [],
        img: null,
        pageYOffset: 0
    }

    componentDidMount() {
        window.addEventListener('scroll', this.scrollHandler)
        this.displayRestaurants()
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.scrollHandler)
    }

    scrollHandler = () => this.setState({ pageYOffset: window.pageYOffset })

    touchStart = () => {

    }

    touchMove = () => {

    }

    touchEnd = () => {

    }

    click = () => {

    }

    displayRestaurants = () => {
        const restaurants = []
        const src = 'https://www.nrn.com/sites/nrn.com/files/styles/article_featured_standard/public/burgerandfriescosts_0.jpg?itok=_S_HQsx_'

        for (let i = 0; i < 10; i++) {
            restaurants.push(
                <div key={i} className={classes.Item}>
                    <Restaurant
                        touchStart={this.touchStart}
                        touchMove={this.touchMove}
                        touchEnd={this.touchEnd}
                        click={this.click}
                        img={src}>{i}
                    </Restaurant>
                </div>
            )
        }

        this.setState({ restaurants: restaurants })
    }

    render() {
        let headerClasses = classes.Header
        if (this.state.pageYOffset > 0)
            headerClasses += ' ' + classes.ScrollingDown
        
        return (
            <div className={classes.Home}>
                <header className={headerClasses}>shmack</header>
                <main>
                    <section>
                        <div className={classes.Category}>Your Places</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                    <section>
                        <div className={classes.Category}>Your Recommendations</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                    <section>
                        <div className={classes.Category}>Mexican</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                    <section>
                        <div className={classes.Category}>Chinese</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                    <section>
                        <div className={classes.Category}>Italian</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                    <section>
                        <div className={classes.Category}>French</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                    <section>
                        <div className={classes.Category}>Japanese</div>
                        <div className={classes.List}>
                            {this.state.restaurants}
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}

export default Home

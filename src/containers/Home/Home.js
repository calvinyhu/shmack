import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Home.css'
import { createGooglePlacePhotoQuery } from '../../utilities/google'
import Restaurant from '../../components/Restaurant/Restaurant'
import { SOURCE } from '../Restaurants/Restaurants'
import Card from '../../components/UI/Card/Card'

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth,
        isGettingYourPlaces: state.home.getting,
        yourPlaces: state.home.yourPlaces,
        yourPlacesDetails: state.home.yourPlacesDetails
    }
}

class Home extends Component {
    state = {
        isAtTop: true,
        isCardOpen: false,
        isCardTurned: false,
        card: null,
        cardSrc: null,
        yourPlaces: null,
        restaurants: null,
        img: null
    }

    componentDidMount() {
        if (this.props.yourPlacesDetails) {
            this.setState({
                yourPlaces: this.displayYourPlaces(this.props.yourPlacesDetails),
                restaurants: this.displayRestaurants()
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.yourPlacesDetails) {
            this.setState({
                yourPlaces: this.displayYourPlaces(nextProps.yourPlacesDetails),
                restaurants: this.displayRestaurants()
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.yourPlacesDetails && this.props.yourPlacesDetails 
            && nextProps.yourPlacesDetails.length !== this.props.yourPlacesDetails.length)
            return true
        else if (nextProps.isGettingYourPlaces !== this.props.isGettingYourPlaces)
            return true
        else if (nextState !== this.state) {
            if (nextState.yourPlaces !== this.state.yourPlaces
                || nextState.isAtTop !== this.state.isAtTop
                || nextState.isCardOpen !== this.state.isCardOpen
                || nextState.isCardTurned !== this.state.isCardTurned)
            return true
            else return false
        }
        else
            return false
    }

    mainScrollHandler = (event) => {
        const targetId = event.target.id
        const scrollTop = event.target.scrollTop

        if (targetId === 'main') {
            this.setState({
                isAtTop: scrollTop === 0
            })
        }
    }

    restaurantClicked = (data, src) => {
        this.setState({
            isCardOpen: true,
            card: data,
            cardSrc: src
        })
    }

    turnCardHandler = () => this.setState(prevState => {
        return { isCardTurned: !prevState.isCardTurned }
    })

    closeModalHandler = () => this.setState({
        isCardOpen: false,
        isCardTurned: false
    })

    displayYourPlaces = (yourPlacesDetails) => {
        if (!yourPlacesDetails) return null

        const yourPlaces = []
        yourPlacesDetails.forEach(placeDetails => {
            let place = placeDetails.data
            let id = place.id
            let src = SOURCE.YELP
            let imgUrl = place.image_url
            let name = place.name
            let rating = place.rating

            if (placeDetails.data.result) {
                place = placeDetails.data.result
                id = place.place_id
                src = SOURCE.GOOGLE
                if (place.photos) {
                    imgUrl = createGooglePlacePhotoQuery(
                        place.photos[0].photo_reference,
                        place.photos[0].width
                    )
                }
                name = place.name
                rating = place.rating
            }

            yourPlaces.push(
                <div key={id} className={classes.Item}>
                    <Restaurant
                        id={id}
                        click={() => this.restaurantClicked(place, src, id)}
                        img={imgUrl}>
                        {name}{rating}
                    </Restaurant>
                </div>
            )
        })
        return yourPlaces
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

        return restaurants
    }

    render() {
        let headerClasses = classes.Header
        if (this.state.isAtTop)
            headerClasses += ' ' + classes.AtTop

        let yourPlaces = null
        if (this.state.yourPlaces)
            yourPlaces = this.state.yourPlaces
        else if (this.props.isGettingYourPlaces)
            yourPlaces = <p>Getting your places...</p>
        else if (this.props.isAuth)
            yourPlaces = <p>Mark your places down to get recommendations.</p>
        else
            yourPlaces = <p>Login to get your places.</p>

        let card = (
            <Card restaurant
                click={this.turnCardHandler}
                close={this.closeModalHandler}
                cardSrc={this.state.cardSrc}
                isTurned={this.state.isCardTurned}
                isOpen={this.state.isCardOpen}>{this.state.card}</Card>
        )

        return (
            <div className={classes.Home}>
                <header className={headerClasses}>shmack</header>
                <main id='main' onScroll={this.mainScrollHandler}>
                    <section>
                        <div className={classes.Category}>Your Places</div>
                        <div className={classes.List}>
                            {yourPlaces}
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
                {card}
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(Home)

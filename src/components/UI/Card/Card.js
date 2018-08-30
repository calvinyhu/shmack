import React from 'react'

import classes from './Card.css'
import { SOURCE } from '../../../containers/Restaurants/Restaurants'
import { createGooglePlacePhotoQuery } from '../../../utilities/google';
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const card = (props) => {
    let card = null

    if (props.restaurant) {
        let classNames = classes.RestaurantCard

        if (props.isOpen)
            classNames = [classNames, classes.RestaurantCardOpen].join(' ')

        let img = null
        let title = null
        let rating = null
        let reviewCount = null
        let price = null
        let address1 = null
        let address2 = null
        let phone = null
        if (props.children) {
            const details = props.children
            if (props.cardSrc === SOURCE.YELP) {
                img = details.image_url
                rating = details.rating
                reviewCount = details.review_count
                price = details.price
                address1 = details.location.display_address[0]
                address2 = details.location.display_address[1]
                phone = details.display_phone
            }
            if (props.cardSrc === SOURCE.GOOGLE) {
                img = createGooglePlacePhotoQuery(
                    details.photos[0].photo_reference,
                    details.photos[0].width
                )
            }
            title = details.name
        }

        card = (
            <div className={classNames}>
                <div className={classes.ImgContainer}>
                    <img src={img} alt='restaurant' />
                </div>
                <div className={classes.Details}>
                    <div className={classes.Headline}>
                        <div className={classes.Title}>{title}</div>
                        <div className={classes.Price}>{price}</div>
                    </div>
                    <div className={classes.Perception}>
                        <div>{rating}</div>
                        <div>{reviewCount}</div>
                    </div>
                    <div className={classes.Location}>
                        <div>{address1}</div>
                        <div>{address2}</div>
                    </div>
                    <div className={classes.Phone}>{phone}</div>
                </div>
            </div>
        )
    }

    return card
}

export default card

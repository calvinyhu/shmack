import React from 'react'

import classes from './Card.css'
import { SOURCE } from '../../../containers/Restaurants/Restaurants'
import { createGooglePlacePhotoQuery } from '../../../utilities/google';

const card = (props) => {
    let card = null

    if (props.restaurant) {
        let classNames = classes.RestaurantCard
        if (props.isOpen)
            classNames = [classNames,classes.RestaurantCardOpen].join(' ')
        else
            classNames = [classNames, classes.RestaurantCardClose].join(' ')

        if (props.isTurned)
            classNames = [classNames, classes.RestaurantCardTurn].join(' ')

        let img, title, rating, reviewCount, price = null
        let address1, address2, address3, phone = null
        if (props.children) {
            const details = props.children
            if (props.cardSrc === SOURCE.YELP) {
                img = details.image_url
                reviewCount = details.review_count + ' reviews'
                price = details.price ? details.price : 'New!'
                address1 = details.location.display_address[0]
                address2 = details.location.display_address[1]
                address3 = details.location.display_address[2]
                phone = details.display_phone
            }
            if (props.cardSrc === SOURCE.GOOGLE) {
                img = createGooglePlacePhotoQuery(
                    details.photos[0].photo_reference,
                    details.photos[0].width
                )
                switch (details.price_level) {
                    case 1: price = '$'; break
                    case 2: price = '$$'; break
                    case 3: price = '$$$'; break
                    case 4: price = '$$$$'; break
                    default: price = '?'
                }
                address1 = details.vicinity
            }
            title = details.name
            rating = details.rating === 1 ? details.rating + ' star' : details.rating + ' stars'
        }

        let front = (
            <div className={classes.RestaurantCardFront}>
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
                        <div>{address3}</div>
                    </div>
                    <div className={classes.Phone}>{phone}</div>
                </div>
            </div>
        )

        let back = (
            <div className={classes.RestaurantCardBack}>
                <div className={classes.PopularItems}>
                    <div className={classes.Title}>Certified shmack</div>
                </div>
            </div>
        )

        card = (
            <div className={classNames} onClick={props.click}>
                {front}
                {back}
            </div>
        )
    }

    return card
}

export default card

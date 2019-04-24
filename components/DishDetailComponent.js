import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Picker, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, postToCart } from '../redux/ActionCreators';
import Comment from './CommentForm';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
        carts: state.carts

    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postToCart: (dishId) => dispatch(postToCart(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
});



function RenderDish(props) {
    const dish = props.dish;

    handleViewRef= ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    };

    const panResponder = PanResponder.create({
        
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorites',
                    'Are you Sure you wish to add ' + dish.name + ' to your favorites?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                )
            return true;
        }
    })

    if (props.isLoading) {
        return (
            <Loading />
        );
    }
    else if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }
    else if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                <Card featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        flexDirection: 'row',
                        margin: 20
                    }}>
                        <Text style={{ margin: 10, fontSize: 20, alignContent: 'flex-end', color: 'red' }}>{'Price:' + dish.price + '$'}</Text>
                    </View>
                    <View style={{ justiftyContent: 'space-between', flexDirection: 'row' }}>
                        <Icon raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favourite') : props.onPress()} />

                        <Comment dishId={dish.id} postComment={props.postComment} />
                        <Icon raised
                            reverse
                            name={props.cart ? 'shopping-basket' : 'shopping-cart'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.cart ? console.log('Already added to cart') : props.onPressCart()} />
                    </View>
                </Card>
            </Animatable.View>
        );
    } else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    imageSize={20}
                    readonly
                    startingValue={item.rating}
                    style={{ flex: 1, alignItems: 'flex-start' }}
                />
                <Text style={{ fontSize: 12 }}>{'--' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()} />
            </Card>
        </Animatable.View>
    );
}

class DishDetail extends Component {

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    addToCart(dishId) {
        this.props.postToCart(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    cart={this.props.carts.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    postComment={this.props.postComment}
                    onPressCart={() => this.addToCart(dishId)}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
            </ScrollView>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);
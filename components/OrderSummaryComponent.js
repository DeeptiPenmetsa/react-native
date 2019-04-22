import React, { Component } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import Swipeout from 'react-native-swipeout'
import { deleteOrder } from '../redux/ActionCreators'
import { ScrollView } from 'react-native-gesture-handler';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        carts: state.carts
    }
}

const mapDispatchToProps = dispatch => ({
    deleteOrder: (dishId) => dispatch(deleteOrder(dishId))
})

class ListItem extends Component {

    state = {
        quantity: 1
    }

    onSubtract = () => {
        this.setState({ quantity: this.state.quantity - 1 });
    }

    onAdd = () => {
        this.setState({ quantity: this.state.quantity + 1 });
    }

    render() {
        const { item } = this.props;
        const { quantity } = this.state;


        const rightButton = [
            {
                text: 'Delete',
                type: 'delete',
                onPress: () => {
                    Alert.alert(
                        'Delete Order ?',
                        'Are you sure you wish to delete this dish ' + item.name + ' from cart?',
                        [
                            {
                                text: 'Cancel',
                                onPress: () => console.log(item.name + 'Not Deleted'),
                                style: ' cancel'
                            },
                            {
                                text: 'OK',
                                onPress: () => this.props.deleteOrder(item.id)
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        ];

        return (
            <Swipeout right={rightButton} autoClose={true}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Avatar
                        rounded
                        source={{
                            uri: baseUrl + item.image
                        }}
                    />

                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                        <Text>{item.name} - {item.price}$</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Button title="-" onPress={this.onSubtract} color="#841584" />
                        <Text> {quantity} </Text>
                        <Button title="+" onPress={this.onAdd} color="#841584" />
                    </View>
                </View>
            </Swipeout>
        );
    }
}

class OrderSummary extends Component {

    static navigationOptions = {
        title: 'Order Summary'
    }

    render() {
        const { navigate } = this.props.navigation;
        if (this.props.dishes.isLoading) {
            return (
                <Loading />
            );
        } else if (this.props.dishes.errMess) {
            <View>
                <Text>{this.props.dishes.errMess}</Text>
            </View>
        } else {
            return (
                <ScrollView>
                    <FlatList
                        data={this.props.dishes.dishes.filter(dish => this.props.carts.some(el => el === dish.id))}
                        renderItem={({ item }) => <ListItem item={item} deleteOrder={this.props.deleteOrder}/>}
                        keyExtractor={item => item.id.toString()}
                    />
                    <Text>Total Price:</Text>
                </ScrollView>

            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
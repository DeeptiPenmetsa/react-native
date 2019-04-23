import React, { Component } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { Avatar, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import Swipeout from 'react-native-swipeout'
import { deleteOrder, putDish } from '../redux/ActionCreators'
import { ScrollView } from 'react-native-gesture-handler';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        carts: state.carts
    }
}

const mapDispatchToProps = dispatch => ({
    deleteOrder: (dishId) => dispatch(deleteOrder(dishId)),
    putDish: (id,name, image, category, label, price, featured, quantity, description) => dispatch(putDish(id, name, image, category, label, price, featured, quantity, description))
})

class ListItem extends Component {

    render() {
        const { item } = this.props;
       
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
                        <Button title="-" onPress={this.props.onSubtract} color="#841584" />
                        <Text> {item.quantity} </Text>
                        <Button title="+" onPress={this.props.onAdd} color="#841584" />
                    </View>
                </View>
            </Swipeout>
        );
    }
}

class OrderSummary extends Component {

    onSubtract = (item, index) => {
        const dishes={...this.props.dishes.dishes};
        dishes[index].quantity -=1;
        this.setState(dishes);
        this.props.putDish(dishes[index].id,dishes[index].name, dishes[index].image, dishes[index].category, dishes[index].label,
             dishes[index].price, dishes[index].featured, dishes[index].quantity, dishes[index].description);
    }

    onAdd = (item, index) => {
        const dishes={...this.props.dishes.dishes};
        dishes[index].quantity +=1;
        this.setState(dishes);
        this.props.putDish(dishes[index].id,dishes[index].name, dishes[index].image, dishes[index].category, dishes[index].label,
            dishes[index].price, dishes[index].featured, dishes[index].quantity, dishes[index].description);
    }

    static navigationOptions = {
        title: 'Order Summary'
    }

    render() {
        const { navigate } = this.props.navigation;
        let totalPrice = 0;
        this.props.dishes.dishes.forEach((item) => {
           totalPrice += item.quantity * item.price;
        });
        
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
                        renderItem={({ item, index }) => 
                        <ListItem item={item}
                        onSubtract={()=>this.onSubtract(item,index)}
                        onAdd={()=>this.onAdd(item,index)}
                         deleteOrder={this.props.deleteOrder} />}
                        keyExtractor={item => item.id.toString()}
                    />
                    <Text>Total Price : {totalPrice}$</Text>
                </ScrollView>

            );
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderSummary);
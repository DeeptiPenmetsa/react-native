import React,{Component} from 'react';
import {View,FlatList, Text, Alert} from 'react-native';
import {ListItem} from 'react-native-elements';
import {connect} from 'react-redux';
import{baseUrl} from '../shared/baseUrl';
import{Loading} from './LoadingComponent';
import Swipeout from 'react-native-swipeout'
import {deleteOrder} from '../redux/ActionCreators'

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      carts: state.carts
    }
  }

  const mapDispatchToProps= dispatch => ({
    deleteOrder: (dishId)=> dispatch(deleteOrder(dishId))
  })

  class OrderSummary extends Component{
  
    static navigationOptions= {
        title: 'Order Summary'
    }

    render(){
        const {navigate} = this.props.navigation;

        const renderMenuItem = ({item,index}) => {
            const rightButton = [
                {
                    text: 'Delete', 
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Delete Order ?' ,
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
            return(
                <Swipeout right={rightButton} autoClose={true}>
                <ListItem
                key={index}
                title={item.name}
                subtitle={item.price}
                rightTitle='Quantity'
                rightSubtitle={item.quantity}
                hideChevron={true}
                onPress={() => navigate ('DishDetail', {dishId:item.id})}
                leftAvatar={{ source: {uri: baseUrl + item.image}}}
                    />
                </Swipeout>
            );
        }

        if(this.props.dishes.isLoading){
            return(
                <Loading />
            );
        } else if(this.props.dishes.errMess){
                <View>            
                    <Text>{this.props.dishes.errMess}</Text>
                </View>   
        }else {
            return(
                <FlatList 
                data={this.props.dishes.dishes.filter(dish => this.props.carts.some(el => el === dish.id))}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
                /> 
            );
        }
    }

  }

  export default connect(mapStateToProps,mapDispatchToProps)(OrderSummary);
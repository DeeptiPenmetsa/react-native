import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, TextInput } from 'react-native';
import { Card, AirbnbRating, Icon } from 'react-native-elements';

class Comment extends Component {

    static navigationOptions = {
        title: 'Comment'
    };

    constructor(props) {
        super(props);
        this.state = {
            rating: '',
            author: '',
            comment: '',
            date: new Date(),
            modalVisible: false,
        }
    }
    resetForm() {
        this.setState({
            rating: '',
            author: '',
            date: '',
            comment: '',
            modalVisible: false
        });
    }
    handleSubmit() {
        console.log(JSON.stringify(this.state));
        this.props.postComment(this.props.dishId, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    }

    toggleModal() {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }


    render() {
        return (
            <>
                <Icon raised
                    reverse
                    name='comment'
                    type='font-awesome'
                    color='#383182'
                    onPress={() => this.toggleModal()} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.modalVisible}
                    onDismiss={() => { this.toggleModal(); this.resetForm() }}
                    onRequestClose={() => { this.toggleModal(); this.resetForm() }}
                >
                    <AirbnbRating
                        showRating
                        value={this.state.rating}
                        onFinishRating={(value) => this.setState({ rating: value })}
                        style={{ paddingVertical: 10 }}
                    />
                    <TextInput
                        placeholder='Author'
                        leftIcon={
                            <Icon
                                name='user'
                                size={24}
                                color='black'
                            />
                        }
                        value={this.state.author}
                        onChangeText={(value) => this.setState({ author: value })}
                    />
                    <TextInput
                        placeholder='Comment'
                        leftIcon={
                            <Icon
                                name='comment'
                                size={24}
                                color='black'
                            />
                        }
                        value={this.state.comment}
                        onChangeText={(value) => this.setState({ comment: value })}

                    />
                    <View>
                        <Button
                            onPress={() => this.handleSubmit()}
                            title="Submit"
                            color="#512DA8"
                        />

                        <Button
                            onPress={() => { this.toggleModal(); this.resetForm(); }}
                            color="#512DA8"
                            title="Close"
                        />
                    </View>
                </Modal>
            </>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#ede3f2',
        padding: 100
    }
});

export default Comment;
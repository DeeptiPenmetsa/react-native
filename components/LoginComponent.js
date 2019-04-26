import React, { Component } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Card, Icon, Input, CheckBox } from 'react-native-elements';
import { SecureStore, Permissions } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { baseUrl } from '../shared/baseUrl';
import { connect } from 'react-redux';
import { registerUser} from '../redux/ActionCreators';


const mapStateToProps = state => {
    return {
        users: state.users
    }
}

const mapDispatchToProps = dispatch => ({
    registerUser: (username, password, firstname, lastname, email) => dispatch(registerUser(username, password, firstname, lastname, email))
});


class LoginTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }
    componentDidMount() {
        SecureStore.getItemAsync('userinfo').then((userdata) => {
            let userinfo = JSON.parse(userdata);
            if (userinfo) {
                this.setState({ username: userinfo.username });
                this.setState({ password: userinfo.password });
                this.setState({ remember: true });
            }
        })
    }

    handleLogin() {
        console.log(JSON.stringify(this.state))
        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
                .catch((error) => console.log('Could not save user info', error));
        else
            SecureStore.deleteItemAsync('userinfo')
                .catch((error) => console.log('Could not delete user info', error));

        let filteredUsers = this.props.users.users.filter(user => {
            return user.username === this.state.username && user.password === this.state.password;
        });

        if (filteredUsers.length) {
            const { navigate } = this.props.navigation;
            navigate('Home')
        } else {
            return ('Username or password is incorrect');
        }

    }

    static navigationOptions = {
        title: 'Login'
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            remember: false
        });
    }


    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => { this.setState({ username }) }}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => { this.handleLogin() }}
                            title="Login"
                            icon={
                                <Icon
                                    name='sign-in'
                                    type='font-awesome'
                                    size={24}
                                    color='white'
                                />
                            }
                            buttonStyle={{
                                backgroundColor: "#512DA8"
                            }}
                        />
                    </View>
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => { this.handleLogin(); this.resetForm(); }}
                            title="Logout"
                            icon={
                                <Icon
                                    name='sign-in'
                                    type='font-awesome'
                                    size={24}
                                    color='white'
                                />
                            }
                            buttonStyle={{
                                backgroundColor: "#512DA8"
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }

}

const LoginComponent = connect(mapStateToProps)(LoginTab);

class RegisterTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false
        }
    }

    resetForm() {
        this.setState({
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false
        });
    }

    handleRegister() {
        console.log(JSON.stringify(this.state));
        this.props.registerUser(this.state.username, this.state.password, this.state.firstname, this.state.lastname, this.state.email);
        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({ username: this.state.username, password: this.state.password }))
                .catch((error) => console.log('Could not save user info', error));

    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon
                name='user-plus'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };


    render() {
        const { navigate } = this.props.navigation;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Input
                        placeholder="Username"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(username) => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(firstname) => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(lastname) => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                    />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => { this.handleRegister(); this.resetForm(); navigate('Login') }}
                            title="Register"
                            icon={
                                <Icon
                                    name='user-plus'
                                    type='font-awesome'
                                    size={24}
                                    color='white'
                                />
                            }
                            buttonStyle={{
                                backgroundColor: "#512DA8"
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const registerComponent = connect(mapStateToProps, mapDispatchToProps)(RegisterTab);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20,
    },
    formInput: {
        margin: 20
    },
    formCheckbox: {
        margin: 20,
        backgroundColor: null
    },
    formButton: {
        margin: 20
    }
})

const Login = createBottomTabNavigator({
    Login: LoginComponent,
    Register: registerComponent
}, {
        tabBarOptions: {
            activeBackgroundColor: '#9575CD',
            inactiveBackgroundColor: '#D1C4E9',
            activeTintColor: '#ffffff',
            inactiveTintColor: 'gray'
        }
    });

export default Login;
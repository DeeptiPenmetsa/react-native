import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  Platform,
  FlatList
} from 'react-native';
import { Card, Icon, ListItem, Divider } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
  return {
    contact: state.contact
  }
}

const mainColor = '#01C89E'

function RenderHeader(props) {
  const contact = props.contact;
  return (
    <View style={styles.headerContainer}>
      <ImageBackground
        style={styles.headerBackgroundImage}
        source={{
          uri: contact.avatarBackground,
        }}
      >
        <View style={styles.headerColumn}>
          <Image
            style={styles.userImage}
            source={{
              uri: baseUrl + contact.avatar,
            }}
          />
          <Text style={styles.userNameText}>{contact.name}</Text>
          <View style={styles.userAddressRow}>
            <View>
              <Icon
                name="place"
                underlayColor="transparent"
                iconStyle={styles.placeIcon}
              />
            </View>
            <View style={styles.userCityRow}>
              <Text style={styles.userCityText}>
                {contact.address.city}, {contact.address.country}
              </Text>
            </View>
          </View>
          <View style={styles.userAddressRow}>
            <View style={styles.userCityRow}>
              <Text style={styles.userCityText}>
                {contact.bio}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

function RenderTel(props) {
  const contact = props.contact;
  const renderTelItem = ({ item, index }) => {
    return (
      <ListItem key={index}
        title={item.name}
        subtitle={item.number}
        hideChevron={true}
        leftIcon={
          <Icon
              name='phone'
              size={24}
              color='black'
          />
        }
      />
    )
  }
  return (
      <FlatList
        data={contact.tels}
        renderItem={renderTelItem}
        keyExtractor={item => item.id.toString()}
      />
  );
}

function RenderEmail(props) {
  const contact = props.contact;
  const renderEmailItem = ({ item, index }) => {
    return (
      <ListItem key={index}
        title={item.name}
        subtitle={item.email}
        hideChevron={true}
        leftIcon={
          <Icon
              name='message'
              size={24}
              color='black'
          />
        }
      />
    )
  }
  return (
      <FlatList
        data={contact.emails}
        renderItem={renderEmailItem}
        keyExtractor={item => item.id.toString()}
      />
  );
}


class Profile extends Component {

  static navigationOptions = {
    title: 'My Profile'
  }


  render() {
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.container}>
          <Card containerStyle={styles.cardContainer}>
            <RenderHeader contact={this.props.contact.contact} />
            <RenderTel contact={this.props.contact.contact} />
            {Separator()}
            <RenderEmail contact={this.props.contact.contact} />
          </Card>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderWidth: 0,
    flex: 1,
    margin: 0,
    padding: 0,
  },
  container: {
    flex: 1,
  },
  emailContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 35,
  },
  headerContainer: {},
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  telContainer: {
    backgroundColor: '#FFF',
    flex: 1,
    paddingTop: 30,
  },
  userAddressRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userCityRow: {
    backgroundColor: 'transparent',
  },
  userCityText: {
    color: '#A5A5A5',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  userImage: {
    borderColor: mainColor,
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  userNameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  userBioText: {
    color: 'gray',
    fontSize: 13.5,
    textAlign: 'center',
  }
})

const stylesSeperator = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  separatorOffset: {
    flex: 1,
    flexDirection: 'row',
  },
  separator: {
    flex: 8,
    flexDirection: 'row',
    borderColor: '#523abc',
    borderWidth: 0.8,
  },
})

const Separator = () => (
  <View style={stylesSeperator.container}>
    <View style={stylesSeperator.separatorOffset} />
    <View style={stylesSeperator.separator} />
  </View>
)


export default connect(mapStateToProps)(Profile);

import React from 'react';
import { Grid, LineChart } from 'react-native-svg-charts';
import { Text, View, Dimensions, StyleSheet, SafeAreaView } from 'react-native';
import moment from 'moment';
import Tooltip from './Tooltip';
import { connect } from 'react-redux';
import {Circle} from 'react-native-svg';

const { height } = Dimensions.get('window');

const mapStateToProps = state => {
  return {
      comments: state.comments,
      dishes: state.dishes
  }
}

class Area extends React.PureComponent {
  state = {
    data: [],
    tooltipX: null,
    tooltipY: null,
    tooltipIndex: null,
  };

  componentDidMount() {
    this.reorderData();
  }

  static navigationOptions =
   {
      title: 'Area'
   };

  reorderData = () => {
    const dishId = this.props.navigation.getParam('dishId', '');
    const commentsData=this.props.comments.comments.filter((comment) => comment.dishId === dishId);
    const reorderedData = commentsData.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    this.setState({
      data: reorderedData,
    });
  };

  render() {
    const { data, tooltipX, tooltipY, tooltipIndex } = this.state;
    const contentInset = { left: 10, right: 10, top: 10, bottom: 7 };

    const ChartPoints = ({ x, y, color }) =>
    data.map((item, index) => (
        <Circle
          key={index}
          cx={x(moment(item.date))}
          cy={y(item.rating)}
          r={6}
          stroke={color}
          fill="#512DA8"
          onPress={() =>
            this.setState({
              tooltipX: moment(item.date),
              tooltipY: item.rating,
              tooltipIndex: index,
            })
          }
        />
      ));

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {data.length !== 0 ? (
            <LineChart
              style={{ height: '70%' }}
              data={data}
              yAccessor={({ item }) => item.rating}
              xAccessor={({ item }) => moment(item.date)}
              contentInset={contentInset}
              svg={{ stroke: 'rgb(134, 65, 244)' }}
              numberOfTicks={10}
              yMin={0}
              yMax={10}
            >
              <Grid svg={{ stroke: 'rgba(85, 85, 85, 0.2)' }} belowChart={false} />
              <ChartPoints color="#003F5A" />
              <Tooltip
                tooltipX={tooltipX}
                tooltipY={tooltipY}
                color="#003F5A"
                index={tooltipIndex}
                dataLength={data.length}
              />
            </LineChart>
          ) : (
            <View
              style={{
                height: '50%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: '#ccc',
                }}
              >
                There are no responses for this month.
              </Text>
            </View>
          )}
          <Text style={styles.heading}>Dish Popularity</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height / 2,
    flex: 1,
  },
  heading: {
    fontSize: 25,
    textAlign: 'center',
  },
});

export default connect(mapStateToProps)(Area);
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS,
    ListView,
    Animated,
    PanResponder,
    } = React;
var RefreshListView = require("react-native-refreshlist");

var ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2});
var list = React.createClass({

        getInitialState(){

            this.data = this.getData();

            return {
                dataSource: ds.cloneWithRows(this.data)
            }

        },

        getData(){
            var list = [];

            for (var i = 0; i < 20; i++) {
                list[i] = "Row" + i;
            }
            return list;
        },

        createRow(data){
            // console.log(data)
            return <Text
                style={{height:40,textAlign:'center',borderBottomColor:'black',borderBottomWidth:1}}>{data}</Text>;
        },

        handleRefresh(){
            this.data = this.getData();

            this.setState({
                dataSource: ds.cloneWithRows(this.data)
            })
        },

        handleLoadingMore(){

            var s=this.getData();
            this.data=this.data.concat(s);


            this.setState({
                dataSource: ds.cloneWithRows(this.data)
            })
        },


        render()
        {
            return <RefreshListView style={{flex:1}} dataSource={this.state.dataSource}
                                    pageSize={20}
                                    renderRow={this.createRow}
                                    doRefresh={this.handleRefresh}
                                    inNavigator={false}
                                    isPullUp={true}
                                    doLoadingMore={this.handleLoadingMore}
                />
        }
    })
    ;

var styles = StyleSheet.create({});


AppRegistry.registerComponent('livebos_ios', () => list);




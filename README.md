
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
var app = React.createClass({

      getInitialState(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 !== r2});

        var list = [];

        for (var i = 0; i < 50; i++) {
          list[i] = "Row" + i;
        }


        return {
          dataSource: ds.cloneWithRows(list)
        }

      },

      createRow(data){
        // console.log(data)
        return <Text >{data}</Text>;
      },


      render()
      {
        return <RefreshListView dataSource={this.state.dataSource}
                               
                                renderRow={this.createRow}/>
      }
    })
    ;

var styles = StyleSheet.create({

});


AppRegistry.registerComponent('test', () => app);




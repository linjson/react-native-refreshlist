'use strict';
var React = require('react-native');
var {
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS,
    ListView,
    Animated,
    PanResponder,
    PropTypes,
    } = React;
var delay = require('./delay');

var RefrechListView = React.createClass({


        getInitialState(){
            this.loadingContainerHeight = 50;
            return {
                top: new Animated.Value(0),
            };

        },

        handleOnMoveShouldSetPanResponder(e, gestureState){

            //console.log("handleOnMoveShouldSetPanResponder",e.nativeEvent)

            //var visibleRows = this.listviewVisibleRows;
            //
            //if (this.props.dataSource.getRowCount() == 0) {
            //    this.allowPreRefresh = true;
            //    return true;
            //}
            //
            //
            //this.allowPreRefresh = (visibleRows && visibleRows.s1["0"]) || false;
            //
            //if (this.allowRefresh || this.allowLoadingMore) {
            //    return false;
            //}
            //
            ////console.log("==>onMoveShouldSetPanResponder", gestureState.dy);
            //
            ////下拉刷新
            //if (this.props.doRefresh && this.allowPreRefresh && gestureState.dy > 0) {
            //
            //    return true;
            //}
            //
            //this.allowPreRefresh=false;
            //
            ////上拉加载
            //var count = this.props.dataSource.getRowCount() - 1;
            //
            //this.allowPreLoadingMore = (visibleRows.s1[count + ""]) || false;
            //
            //
            //
            //if (this.props.doLoadingMore && this.props.isPullUp && this.allowPreLoadingMore && gestureState.dy < 0) {
            //    return true;
            //}
            //this.allowPreLoadingMore=false;
            //return false;

            if (!this.scrollProperties) {
                return false;
            }


            var visibleRows = this.listviewVisibleRows;

            if (this.props.dataSource.getRowCount() == 0) {
                this.allowPreRefresh = true;
                return true;
            }
            //this.listContentInset=e.nativeEvent.contentInset;
            //this.curentContentOffset

            this.allowPreRefresh = this.scrollProperties.offset <= -this.getInitOffset();

            if (this.allowRefresh || this.allowLoadingMore) {
                return false;
            }

            //console.log("==>onMoveShouldSetPanResponder", gestureState.dy);

            //下拉刷新
            if (this.props.doRefresh && this.allowPreRefresh && gestureState.dy > 0) {
                return true;
            }
            this.allowPreRefresh = false;
            //上拉加载
            //var count = this.props.dataSource.getRowCount() - 1;

            //this.allowPreLoadingMore = (visibleRows.s1[count + ""]) || false;

            //console.log("上拉加载",this.currentScroll);

            this.allowPreLoadingMore = this.scrollProperties.offset + this.scrollProperties.visibleLength >= this.scrollProperties.contentLength;

            if (this.props.doLoadingMore && this.props.isPullUp && this.allowPreLoadingMore && gestureState.dy < 0) {
                return true;
            }


            this.allowPreLoadingMore = false;
            return false;

        },

        handleOnPanResponderMove(e, gestureState){
            //console.log("==>onPanResponderMove", gestureState.dy);

            if (this.allowPreRefresh) {
                this.allowRefresh = gestureState.dy > this.loadingContainerHeight
                this.state.top.setValue(Math.max(gestureState.dy, 0));
            } else if (this.allowPreLoadingMore) {
                this.state.top.setValue(Math.min(gestureState.dy, 0));
                this.allowLoadingMore = gestureState.dy < -this.loadingContainerHeight
            }


        },

        changeViewTop(callback, top, duration){


            this.animiateTop = Animated.timing(
                this.state.top,
                {
                    toValue: top,
                    duration: duration || 300
                }
            )
            this.animiateTop.start(callback);
        },


        handleOnPanResponderRelease(e, gestureState)
        {
            //console.log("==>onPanResponderRelease");
            this.allowPreRefresh = false;
            this.allowPreLoadingMore = false;
            if (this.allowRefresh) {

                this.changeViewTop(()=> {
                    Promise.all([
                        this.handleRefresh(),
                        delay(100)
                    ]).then(()=> {
                        //console.log('close')
                        this.allowRefresh = false;

                        this.changeViewTop(null, 0, 200);
                    });
                }, this.loadingContainerHeight);


            } else if (this.allowLoadingMore) {


                this.changeViewTop(()=> {
                    Promise.all([
                        this.handleLoadingMore(),
                        delay(100)
                    ]).then(()=> {

                        this.allowLoadingMore = false;

                        this.changeViewTop(null, 0, 200);
                    });
                }, -this.loadingContainerHeight);


            } else {
                this.changeViewTop(null, 0, 200);
            }


        }
        ,


        //return Promise object;
        handleRefresh()
        {
            return this.props.doRefresh();
        }
        ,
        //return Promise object;
        handleLoadingMore()
        {
            return this.props.doLoadingMore();
        }
        ,


        componentWillMount()
        {
            this.responder = PanResponder.create({

                onMoveShouldSetPanResponder: this.handleOnMoveShouldSetPanResponder,
                onPanResponderMove: this.handleOnPanResponderMove,
                onPanResponderRelease: this.handleOnPanResponderRelease
            });

        }
        ,


        createLoadingView(viewstyle)
        {
            return <View style={[styles.loadingContainer,{height:this.loadingContainerHeight},viewstyle]}>
                <ActivityIndicatorIOS/>
                <Text style={styles.description}>
                    {"正在加载中..."}
                </Text>
            </View>;
        }
        ,
        createFooterView(){

            if (this.props.dataSource.getRowCount() == 0) {
                return null;
            }


            return <View style={[styles.footView,{height:this.loadingContainerHeight}]}>
                <Text style={styles.description}>
                    {this.props.isPullUp ? "加载更多" : "没有更多数据了"}
                </Text>
            </View>;
        },

        getInitOffset(){
            var offset = this.props.inNavigator ? 64 : 0;
            return offset;
        },
        render()
        {
            var animationStyle = (value) => {
                return {
                    transform: [{
                        translateY: value
                    }]
                };
            };

            var offset = this.getInitOffset();

            return <View style={[{top:offset},this.props.style]}>
                {this.createLoadingView({top: 0})}
                {this.createLoadingView({bottom: 0})}
                <Animated.View style={[{flex:1},animationStyle(this.state.top)]}  {...this.responder.panHandlers}>
                    <ListView ref="list" style={{}} {...this.props}
                              automaticallyAdjustContentInsets={false}
                              contentInset={{top:offset,bottom:0,right:0,left:0}}
                              contentOffset={{x:0,y:-offset}}
                              renderFooter={this.createFooterView}
                              onChangeVisibleRows={(visibleRows,changeRows)=>{
                                        //this.listviewVisibleRows=visibleRows;
                                        if(!this.initFirst){
                                            this.scrollProperties=this.refs.list.scrollProperties;
                                            this.scrollProperties.offset=-offset;
                                            this.initFirst=true;
                                        }
                                        console.log('onChangeVisibleRows',this.refs.list.scrollProperties);
                                    }}

                              onScroll={(e)=>{
                                        this.scrollProperties=this.refs.list.scrollProperties;
                                          console.log('onScroll',this.scrollProperties);
                                  }}

                        ></ListView>

                </Animated.View>
            </View>;
        }


    })
    ;

var styles = StyleSheet.create({
    loadingContainer: {
        flexDirection: "row",
        position: 'absolute',
        right: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    description: {
        marginLeft: 10,
    },
    footView: {
        justifyContent: 'center',
        alignItems: 'center'
    }

});

RefrechListView.propTypes = {
    isPullUp: PropTypes.boolean,
    inNavigator: PropTypes.boolean,
    doRefresh: PropTypes.func,
    doLoadingMore: PropTypes.func,

}


module.exports = RefrechListView;
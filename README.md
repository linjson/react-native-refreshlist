
### method
- `doRefresh`:刷新加载方法
- `doLoadingMore`:上拉加载方法

### props
- `inNavigator`:是否在navigator容器内
- `isPullUp`:是否需要上拉加载

### demo
```
var RefreshListView = require("react-native-refreshlist");
<RefreshListView style={{flex:1}} dataSource={this.state.dataSource}
                                renderRow={this.createRow}
                                doRefresh={this.handleRefresh}
                                inNavigator={false}
                                isPullUp={true}
                                doLoadingMore={this.handleLoadingMore}
            />
```

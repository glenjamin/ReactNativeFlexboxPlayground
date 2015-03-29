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
  Image,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  StatusBarIOS,
  TextInput
} = React;

var alignSelf = ['auto', 'flex-start', 'flex-end', 'center', 'stretch'];

var containerStyles = {
  flexDirection: ['column', 'row'],
  justifyContent: ['center', 'flex-start', 'flex-end',
                   'space-between', 'space-around'],
  alignItems: ['flex-start', 'flex-end', 'center', 'stretch'],
  flexWrap: ['nowrap', 'wrap'],
  alignSelf: alignSelf
};

var ReactNativeFlexboxPlayground = React.createClass({
  componentDidMount: function() {
    StatusBarIOS.setHidden(true);
  },
  getInitialState: function() {
    var containerStyle = {};
    Object.keys(containerStyles).forEach(
      (k) => containerStyle[k] = containerStyles[k][0]
    );
    return {
      selected: null,
      containerStyle: containerStyle,
      views: [
        {
          text: "Tap the title to edit the container",
          style: this.buildBoxStyle()
        },
        {
          text: "Tap on boxes like this one to edit them",
          style: this.buildBoxStyle()
        },
      ]
    };
  },
  deselect() {
    this.setState({selected: null});
  },
  selectContainer() {
    this.setState({selected: "container"});
  },
  selectChild(i) {
    this.setState({selected: i});
  },
  addChild(text) {
    var child = {
      text: text || "...",
      style: this.buildBoxStyle()
    };
    this.setState(
      (s) => ({ views: s.views.concat(child) }),
      () => this.selectChild(this.state.views.length - 1)
    );
  },
  updateContainerStyle(style) {
    this.setState({containerStyle: style});
  },
  updateChildText(index, text) {
    this.setState(s => {
      s.views[index].text = text;
      return { views: s.views };
    });
  },
  updateChildStyle(index, style) {
    this.setState(s => {
      s.views[index].style = style;
      return { views: s.views };
    });
  },
  buildBoxStyle() {
    return {
      flex: 0,
      alignSelf: 'auto',
      backgroundColor: '#99ff99'
    };
  },
  render: function() {
    var configPanel = null;
    if (this.state.selected == 'container') {
      configPanel = (
        <ContainerConfigPanel
          data={this.state.containerStyle}
          onClose={this.deselect}
          onChange={this.updateContainerStyle}
        />
      );
    } else if (this.state.selected != null) {
      var index = this.state.selected;
      configPanel = (
        <ChildConfigPanel
          key={index}
          index={index}
          text={this.state.views[index].text}
          data={this.state.views[index].style}
          onClose={this.deselect}
          onTextChange={text => this.updateChildText(index, text)}
          onStyleChange={style => this.updateChildStyle(index, style)}
        />
      );
    }
    var containerStyle = this.state.containerStyle;
    return (
      <View style={styles.page}>
        <Header
          onHeadingPress={this.selectContainer}
          onAdd={this.addChild}
        />
        <ScrollView
          style={styles.containerScroll}
          contentContainerStyle={[styles.container, containerStyle]}
        >
          {this.state.views.map(({text, style}, i) =>
            <FlexChild
              key={i} style={style} text={text}
              onPress={() => this.selectChild(i)}
            />
          )}
        </ScrollView>
        {configPanel &&
          <View style={styles.config}>{configPanel}</View>}
      </View>
    );
  }
});

var Header = React.createClass({
  render() {
    return (
      <View style={styles.header}>
        <View style={styles.button} />
        <View style={styles.heading}>
          <TouchableOpacity onPress={this.props.onHeadingPress}>
            <Text style={styles.headingText}>
              Flexbox Playground
            </Text>
          </TouchableOpacity>
        </View>
        <TextButton size={20} onPress={this.props.onAdd}>+</TextButton>
      </View>
    );
  }
});

var TextButton = React.createClass({
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.button}>
          <Text style={{fontSize: this.props.size}}>
            {this.props.children}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
});

var FlexChild = React.createClass({
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[styles.child, this.props.style]}>
          <Text>{this.props.text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
});

var ContainerConfigPanel = React.createClass({
  update(key, val) {
    this.props.onChange(Object.assign({}, this.props.data, { [key]: val }));
  },
  render() {
    var data = this.props.data;
    return (
      <View style={styles.configPanel}>
        <ConfigHeading onClose={this.props.onClose}>
          Configure Container
        </ConfigHeading>
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={styles.form}
        >
          {Object.keys(containerStyles).map(
            property => (
              <View key={property} style={styles.formRow}>
                <Text style={styles.formLabel}>{property}</Text>
                <Select
                  style={styles.formInput}
                  currentValue={data[property]}
                  onSelect={val => this.update(property, val)}
                >
                  {containerStyles[property].map(
                    val => <SelectItem key={val} value={val} />
                  )}
                </Select>
              </View>
            )
          )}
        </ScrollView>
      </View>
    );
  }
});

var ChildConfigPanel = React.createClass({
  getInitialState: function() {
    return { flex: this.props.data.flex };
  },
  updateFlex(val) {
    this.setState({flex: val});
    var int = parseInt(val, 10);
    if (int == val) {
      this.updateStyle('flex', int);
    }
  },
  updateStyle(key, val) {
    this.props.onStyleChange(
      Object.assign({}, this.props.data, { [key]: val }));
  },
  render() {
    var data = this.props.data;
    return (
      <View style={styles.configPanel}>
        <ConfigHeading onClose={this.props.onClose}>
          Configure Box {this.props.index + 1}
        </ConfigHeading>
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={styles.form}
        >
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Text</Text>
            <TextInput
              style={[styles.formInput, styles.formTextInput]}
              value={this.props.text}
              onChangeText={this.props.onTextChange}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>flex</Text>
            <TextInput
              style={[
                styles.formInput, styles.formTextInput,
                this.state.flex != data.flex && styles.formError
              ]}
              value={'' + this.state.flex}
              onChangeText={val => this.updateFlex(val)}
            />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>alignSelf</Text>
            <Select
              style={styles.formInput}
              currentValue={data.alignSelf}
              onSelect={val => this.updateStyle('alignSelf', val)}
            >
              {alignSelf.map(
                val => <SelectItem key={val} value={val} />
              )}
            </Select>
          </View>
        </ScrollView>
      </View>
    );
  }
});

var ConfigHeading = React.createClass({
  render() {
    return (
      <View style={styles.configHeading}>
        <View style={styles.button} />
        <Text style={styles.configHeadingText}>
          {this.props.children}
        </Text>
        <TextButton size={13} onPress={this.props.onClose}>x</TextButton>
      </View>
    );
  }
});

var Select = React.createClass({
  propTypes: {
    currentValue: React.PropTypes.any,
    onSelect: React.PropTypes.func,
  },
  render() {
    return (
      <View style={[styles.select, this.props.style]}>
        {React.Children.map(this.props.children, child =>
          React.cloneElement(
            child,
            {
              selected: child.props.value == this.props.currentValue,
              onSelect: () => this.props.onSelect(child.props.value)
            }
          )
        )}
      </View>
    );
  }
});

var SelectItem = React.createClass({
  render() {
    return (
      <View style={styles.selectItemContainer}>
        <TouchableOpacity onPress={this.props.onSelect}>
          <View style={[
            styles.selectItem,
            this.props.selected && styles.selectItemSelected
          ]}>
            <Text style={styles.selectItemText}>
              {this.props.value}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
});

function icon(name) {
  return {
    uri: name,
    isStatic: true
  };
}

var rawStyles = {
  page: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  heading: {
    flex: 1,
    padding: 5
  },
  headingText: {
    textAlign: 'center',
    fontSize: 20
  },
  button: {
    width: 25,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerScroll: {
    flex: 3,
    padding: 5,
  },
  container: {
    backgroundColor: '#cccccc'
  },
  child: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },
  config: {
    flex: 2,
    borderTopWidth: 1,
    borderColor: '#000000'
  },
  configPanel: {
    flex: 1,
  },
  configHeading: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center'
  },
  configHeadingText: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
  },
  form: {
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  formRow: {
    paddingTop: 5,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#cccccc'
  },
  formLabel: {
    flex: 1,
    margin: 6,
    fontWeight: 'bold'
  },
  formInput: {
    flex: 2
  },
  formTextInput: {
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
    borderColor: '#cccccc',
  },
  formError: {
    borderColor: '#ff6666'
  },
  select: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectItemContainer: {
    marginRight: 5,
    marginBottom: 5,
  },
  selectItem: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#cccccc',
    backgroundColor: '#ffffff',
  },
  selectItemSelected: {
    borderColor: '#ccccff',
    backgroundColor: '#9999ff'
  },
  selectItemText: {
    textAlign: 'center'
  }
};
var styles = StyleSheet.create(rawStyles);

AppRegistry.registerComponent(
  'ReactNativeFlexboxPlayground',
  () => ReactNativeFlexboxPlayground
);

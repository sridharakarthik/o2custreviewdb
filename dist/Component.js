sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/sap/o2custreviewdb/model/models"],function(e,t,i){"use strict";return e.extend("com.sap.o2custreviewdb.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(i.createDeviceModel(),"device")}})});
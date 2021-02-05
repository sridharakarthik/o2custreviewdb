function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZFC_CIC_APPL_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}
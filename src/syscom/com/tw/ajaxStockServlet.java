package syscom.com.tw;

import java.net.URL;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import syscom.com.tw.base.AjaxBaseServlet;
import util.StockParserUtil;



@WebServlet("/ajaxStockServlet")
public class ajaxStockServlet extends AjaxBaseServlet{

	Logger logger = Logger.getLogger(ajaxStockServlet.class);

    @Override
    protected void executeAjax(HttpServletRequest request, HttpServletResponse response, HttpSession session,
        JSONObject argJsonObj, JSONObject returnJasonObj) throws Exception {
        String ajaxAction=request.getParameter("ajaxAction");
        switch(ajaxAction){
        	case "getStockAhref":
        		logger.info("----getStockAhref");
                String SN=request.getParameter("stockNumber");
                Document xmlDoc=StockParserUtil.getHTMLDoc(SN);//取得htmldoc
                StockParserUtil sp= new StockParserUtil();
        		Map stockAhref=sp.getAhref(xmlDoc);
                
                //JSONArray dataArray = new JSONArray();
                JSONObject ahrefObject=new JSONObject();
                ahrefObject.put("text1",stockAhref.get("field31"));
                ahrefObject.put("href1",stockAhref.get("href31"));
                ahrefObject.put("text2",stockAhref.get("field32"));
                ahrefObject.put("href2",stockAhref.get("href32"));
                ahrefObject.put("text3",stockAhref.get("field33"));
                ahrefObject.put("href3",stockAhref.get("href33"));
                //logger.info(ahrefObject);
                this.setFormData(returnJasonObj, ahrefObject);
                break;
        	case "getTaiwanIndex":
        		logger.info("----getTaiwanIndex");
//        		String TaiwanIndex=StockParserUtil.getJsonTaiwanIndex();//取得htmldoc
//        		logger.info(TaiwanIndex);
//        		
//        		JSONObject JObject=new JSONObject(TaiwanIndex);
//        		this.setFormData(returnJasonObj, JObject);
        		break;
        	case "getPMI":
        		logger.info("getPMI 臺灣採購經理人指數");
        		JSONArray Jarray = new JSONArray();
        		String urlStr="http://ws.ndc.gov.tw/001/administrator/10/relfile/5781/6391/%E8%87%BA%E7%81%A3%E6%8E%A1%E8%B3%BC%E7%B6%93%E7%90%86%E4%BA%BA%E6%8C%87%E6%95%B8(pmi%E5%8F%8Anmi).xml";
        		URL url = new URL(urlStr); 
        		Document PMIxml =  Jsoup.parse(url, 3000);
        		
        		JSONObject PMIdata=new JSONObject();
        		Elements td = PMIxml.select("Data");
        		
        		for (int i=0; i<td.size(); i++){
        			String each=td.get(i).text();
        			if(each.length()==23){//日期 2015-08-01T00:00:00.000
        				JSONObject jo= new JSONObject();
        				jo.put("date",each.substring(0,4)+each.substring(5,7));//201207
        				jo.put("pmi",td.get(i+1).text());//PMI指數
        				Jarray.put(jo);
        			}
        		}
        		
        		logger.info(Jarray);
        		this.setFormData(returnJasonObj, Jarray);
        		break;

        }
                   
    }
	
}

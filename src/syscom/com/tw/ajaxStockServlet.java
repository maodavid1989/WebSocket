package syscom.com.tw;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
	
	public static final Set<String> ipSet = new HashSet<String>();
	Logger logger = Logger.getLogger(ajaxStockServlet.class);

    @Override
    protected void executeAjax(HttpServletRequest request, HttpServletResponse response, HttpSession session,
        JSONObject argJsonObj, JSONObject returnJasonObj) throws Exception {
    	
    	
        String ajaxAction=request.getParameter("ajaxAction");
        switch(ajaxAction){
        	case "getStockAhref":
        		logger.info("----getStockAhref");
                String SN=request.getParameter("stockNumber");
                Document xmlDoc=StockParserUtil.getHTMLDoc(SN);//��ohtmldoc
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
//        		String TaiwanIndex=StockParserUtil.getJsonTaiwanIndex();//htmldoc
//        		logger.info(TaiwanIndex);
//        		JSONObject JObject=new JSONObject(TaiwanIndex);
//        		this.setFormData(returnJasonObj, JObject);
        		break;
        	case "addressValid":       
        		logger.info("into addressValid");
        		boolean pass = true;//default
        		if(ipSet.size()==0){
        			ipSet.add(request.getRemoteAddr());
        		}else{
	            	for(int i=0;i<ipSet.size();i++){
	            		if(ipSet.contains(request.getRemoteAddr())){
	            			pass=false;
	            		}else{
	            			ipSet.add(request.getRemoteAddr());
	            		}
	        		}
        		}
            	
        		logger.info("List IP : "+ipSet);
                JSONObject Jpass=new JSONObject();
                Jpass.put("pass",pass); 
        		this.setFormData(returnJasonObj, Jpass);
        		break;
        	case "closeAddress":
        		ipSet.remove(request.getRemoteAddr());
        		logger.info("websocket connect IP : "+ipSet);
        		this.setFormData(returnJasonObj, "");
        		break;

        }              
    }
}

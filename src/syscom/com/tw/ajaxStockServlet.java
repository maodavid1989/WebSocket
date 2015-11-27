package syscom.com.tw;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
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
	
	public List IPArray= new ArrayList();
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
//        		JSONObject JObject=new JSONObject(TaiwanIndex);
//        		this.setFormData(returnJasonObj, JObject);
        		break;
        	case "addressValid":
        		logger.info("getRemoteAddr:"+request.getRemoteAddr());        		
        		boolean pass = true;
        		if(IPArray.size()==0){
        			IPArray.add(request.getRemoteAddr());//the first connect
        		}else{
            		for(int i=0;i<IPArray.size();i++){
            			if(IPArray.contains(request.getRemoteAddr())){
            				logger.info("contains duplicate!");
            				pass=false;
            			}else{
            				IPArray.add(request.getRemoteAddr());
            			}
            		}
        		}
        		logger.info("List IP : "+IPArray);
                JSONObject Jpass=new JSONObject();
                Jpass.put("pass",pass); 
        		this.setFormData(returnJasonObj, Jpass);
        		break;
        	case "closeAddress":
        		logger.info("----closeIP");
        		IPArray.remove(request.getRemoteAddr());
        		logger.info("now IP has: "+IPArray);
        		this.setFormData(returnJasonObj, "");
        		break;

        }              
    }
}

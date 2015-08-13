package syscom.com.tw;

import java.io.IOException;
import java.net.URL;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import syscom.com.tw.base.AjaxBaseServlet;


@WebServlet("/staticServlet")
public class staticServlet extends AjaxBaseServlet{
	Logger logger = Logger.getLogger(staticServlet.class);
	 @Override
	    protected void executeAjax(HttpServletRequest request, HttpServletResponse response, HttpSession session,
	        JSONObject argJsonObj, JSONObject returnJasonObj) throws Exception {
	    	
	    	JSONArray Jarray = new JSONArray();
	    	JSONObject data=new JSONObject();
	    	Elements td;
	        String ajaxAction=request.getParameter("ajaxAction");
	        switch(ajaxAction){
	        case "getPMI":
        		logger.info("getPMI 臺灣採購經理人指數");
        		td=getOpenData("http://ws.ndc.gov.tw/001/administrator/10/relfile/5781/6391/%E8%87%BA%E7%81%A3%E6%8E%A1%E8%B3%BC%E7%B6%93%E7%90%86%E4%BA%BA%E6%8C%87%E6%95%B8(pmi%E5%8F%8Anmi).xml");
        		for (int i=0; i<td.size(); i++){
        			String each=td.get(i).text();
        			if(each.length()==23){//日期 2015-08-01T00:00:00.000
        				JSONObject jo= new JSONObject();
        				jo.put("date",each.substring(0,4)+each.substring(5,7));//201207
        				jo.put("pmi",td.get(i+1).text());//PMI指數
        				Jarray.put(jo);
        			}
        		}
        		this.setFormData(returnJasonObj, Jarray);
        		break;
        	case "getTWeconomic":
        		logger.info("getTWeconomic 臺灣景氣燈號");
        		td=getOpenData("http://ws.ndc.gov.tw/001/administrator/10/relfile/5781/6392/%E6%96%B0%E8%81%9E%E7%A8%BF%E9%99%84%E4%BB%B6%E6%95%B8%E5%88%97.xml");
        		
        		for (int i=0; i<td.size(); i++){
        			String each=td.get(i).text();
        			
        			if(each.length()==23){//日期 2015-08-01T00:00:00.000
        				JSONObject jo= new JSONObject();
        				
        				String date=each.substring(0,4)+each.substring(5,7);
        				if(Integer.parseInt(date)>201200){
        					
        					jo.put("date",date);//201207
        					jo.put("economic",td.get(i+7).text());//PMI指數
        					Jarray.put(jo);
        				}
        			}
        		}
        		this.setFormData(returnJasonObj, Jarray);
        		break;
        	case "getMoneySuppler":
        		logger.info("getMoneySuppler 貨幣供給");
        		try{
        			//cnYES 鉅亨網
	        	    Document doc = Jsoup.connect("http://www.cnyes.com/CentralBank/moneyPolicy6.aspx").timeout(8000).get();
	        	    Elements link = doc.select("tr");
	        	    //date
	        	    int thSize=link.get(1).select("th").size();
	        	    for( int i=thSize-1; i>=3 ; i--){
	        	    	String date=link.get(1).select("th").get(i).text();
//	        	    	logger.info(date.substring(0,4)+date.substring(5,7));//date
//	        	    	logger.info(link.get(3).select("td").get(i).text());//M1B
//	        	    	logger.info(link.get(4).select("td").get(i).text());//M2
	        	    	JSONObject jo= new JSONObject();
    					jo.put("date",date.substring(0,4)+date.substring(5,7));//date
    					jo.put("M1B",link.get(3).select("td").get(i).text());//M1B
    					jo.put("M2",link.get(4).select("td").get(i).text());//M2
    					Jarray.put(jo);
	        	    }
	        	    logger.info(Jarray);
	        	    this.setFormData(returnJasonObj, Jarray);
        		}catch(Exception e){
        			e.printStackTrace();
        		}
        		break;
	        }
	 }
	 
	public Elements getOpenData(String urlStr) throws IOException{
	    URL url = new URL(urlStr);
		Document xml =  Jsoup.parse(url, 3000);
	    Elements td = xml.select("Data");
	    return td;
	}
}

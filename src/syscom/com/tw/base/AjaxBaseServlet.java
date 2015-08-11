package syscom.com.tw.base;

import java.util.Enumeration;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONException;
import org.json.JSONObject;

public abstract class AjaxBaseServlet extends BaseServlet {
    /**
     * Ajax�q�e�ݶǨ��ݮɩҫ��w���ʧ@
     */
    public static final String AJAX_REQ_ACTION_KEY = "ajaxAction";

    /**
     * Ajax�Ǧ^��e�ݮɹw�]�ϥΪ����~�T��Key
     */
    public static final String AJAX_RES_MSG_EXCEPTION_KEY = "exceptionMsg";

    /**
     * Ajax�Ǧ^��e�ݮɶ�J����ƪ�Key
     */
    public static final String AJAX_RES_FORM_DATA_KEY = "formData";

     @Override
    protected void execute(HttpServletRequest request, HttpServletResponse response) throws Exception {
	JSONObject returnJasonObj = new JSONObject();
	JSONObject argJsonObj = new JSONObject();
	// �N�ǤJ���ѼƶǦ�json
	Enumeration<String> paras = request.getParameterNames();
	String para;
	while (paras.hasMoreElements()) {
	    para = paras.nextElement();
	    argJsonObj.put(para, request.getParameter(para));
	}

	try {
	    HttpSession session = request.getSession();
	    executeAjax(request, response, session, argJsonObj, returnJasonObj);
	} catch (Exception e) {
		logger.info("HttpSession Exception");
	} finally {
	    // returnJasonObj.put(AJAX_RES_MSG_OBJECT_KEY, msgJsonObj);
	    String accept = request.getHeader("Accept");
	    if (accept.contains("application/json")) {// �P�_Browser�O�_�䴩json
	    	response.setContentType("application/json");
	    } else {
	    	response.setContentType("text/html");
	    }
	    response.setCharacterEncoding("UTF-8");
	    response.getWriter().write(returnJasonObj.toString());
	    response.getWriter().flush();
	}

    }
    
    protected abstract void executeAjax(HttpServletRequest request, HttpServletResponse response, HttpSession session,
	    JSONObject argJsonObj, JSONObject returnJasonObj) throws Exception;
    
    
    public void setFormData(JSONObject returnJasonObj, Object data) throws JSONException {
    	returnJasonObj.put(AJAX_RES_FORM_DATA_KEY, data); //return to page
    }   
    
}
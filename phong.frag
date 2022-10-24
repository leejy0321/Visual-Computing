#version 140
#extension GL_ARB_compatibility: enable

in vec4 p;
in vec3 normal;
in float dist;

uniform uint alpha;
uniform vec4 k_d, k_a, k_s;

void main()
{	
	vec3 v = normalize(vec3(-p));
	vec3 n = normalize(normal);
	vec3 l = normalize(vec3(gl_LightSource[0].position - p));
	vec3 r = normalize(reflect(-l,n));
	float att = 1.0 / (gl_LightSource[0].constantAttenuation + gl_LightSource[0].linearAttenuation * dist +
	gl_LightSource[0].quadraticAttenuation * dist * dist);
	vec4 loc_ambient = gl_LightSource[0].ambient * k_a;
	vec4 glb_ambient = gl_LightModel.ambient * k_a;
	vec4 diffuse = k_d * gl_LightSource[0].diffuse;
	vec4 specular = k_s * gl_LightSource[0].specular;
	vec4 FragColor1 = glb_ambient + att * (max(dot(l,n),0) * diffuse + loc_ambient + att * (pow((max(dot(r,v),0)), alpha)) * specular);

	vec3 v2 = normalize(vec3(-p));
	vec3 n2 = normalize(normal);
	vec3 l2 = normalize(vec3(gl_LightSource[1].position - p));
	vec3 r2 = normalize(reflect(-l2,n2));
	float att2 = 1.0 / (gl_LightSource[1].constantAttenuation + gl_LightSource[1].linearAttenuation * dist +
	gl_LightSource[1].quadraticAttenuation * dist * dist);
	vec4 loc_ambient2 = gl_LightSource[1].ambient * k_a;
	vec4 glb_ambient2 = gl_LightModel.ambient * k_a;
	vec4 diffuse2 = k_d * gl_LightSource[1].diffuse;
	vec4 specular2 = k_s * gl_LightSource[1].specular;
	vec4 FragColor2 = glb_ambient2 + att2 * (max(dot(l2,n2),0) * diffuse2 + loc_ambient2 + att2 * (pow((max(dot(r2,v2),0)), alpha)) * specular2);

	gl_FragColor = (FragColor1 + FragColor2) / 2;
}
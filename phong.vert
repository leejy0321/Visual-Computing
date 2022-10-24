#version 140
#extension GL_ARB_compatibility: enable
#extension GL_ARB_explicit_attrib_location : enable

//layout(location = 0) in vec3 position;
layout(location = 1) in vec3 in_normal;

out vec3 normal;
out vec4 p;
out float dist;

void main()
{	
    // object coordinate in H.C
	//vec4 P_obj = gl_Vertex;
	
	// Clip Coordinate
	gl_Position = gl_ModelViewProjectionMatrix * (gl_Vertex);

	vec3 vecdist;
	normal = normalize(gl_NormalMatrix * in_normal);
	p = gl_ModelViewMatrix * gl_Vertex;
	vecdist = vec3(gl_LightSource[0].position - p);
	dist = length(vecdist);
	
	gl_FrontColor = vec4(1,0,0,1);
    gl_BackColor  = vec4(0,0,0,0);
}

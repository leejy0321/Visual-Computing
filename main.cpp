/*
 * Skeleton code for AAA633 Visual Computing
 *
 * Won-Ki Jeong, wkjeong@korea.ac.kr
 *
 */

#include <stdio.h>
#include <GL/glew.h>
#include <GL/glut.h>
#include <iostream>
#include <assert.h>
#include "textfile.h"

#include <string.h>
#include <vector>
#include <sstream>
#include "Vector.h"


// Shader programs
GLuint p;

// Light position
float lpos[4] = {1,0.5,1,0};
float lpos2[4] = { -1, 0.5, 1, 0 };

GLfloat AmbientLightValue[] = { 0.5f, 0.5f, 0.0f, 1.0f };
GLfloat DiffuseLightValue[] = { 0.8f, 0.8f, 0.0f, 1.0f };
GLfloat SpecularLightValue[] = { 0.7f, 0.7f, 0.0f, 1.0f };

int vertices;
int faces;
float* vertexArray;
float* normalArray;
int* indexArray;
float* vnArray;

GLuint VAO;
GLuint abo;
GLuint ebo;

int width, height;

GLfloat mat_specular[] = { 1.0, 1.0, 1.0, 1.0 };
GLfloat mat_diffuse[] = { 1.0, 1.0, 1.0, 1.0 };
GLfloat mat_ambient[] = { 0.0, 0.0, 0.0, 1.0 };
GLuint alpha = 10;

VECTOR3D cameraPos, cameraTarget, cameraDirection, up, cameraRight;

bool leftClicked = false;
bool middleClicked = false;
bool rightClicked = false;

int mouseDownPos[2] = { 0, 0 };
int mousePosX = 0;
int mousePosY = 0;

int deltaX = 0;
int deltaY = 0;

bool isO = false;
bool isP = false;

float scale[3] = { 1.0f, 1.0f, 1.0f };

float radius;
float theta;
float phi;

void cameraSetup() {
	cameraPos = VECTOR3D(0.0f, 0.0f, 10.0f);
	cameraTarget = VECTOR3D(0.0f, 0.0f, 0.0f);
	cameraDirection = cameraPos - cameraTarget;
	cameraDirection.Normalize();
	up = VECTOR3D(0.0f, 1.0f, 0.0f);
	cameraRight = up.CrossProduct(cameraDirection);
	cameraRight.Normalize();
	radius = sqrt(cameraPos.x * cameraPos.x + cameraPos.y * cameraPos.y + cameraPos.z * cameraPos.z);
	theta = acos(cameraPos.y / radius);
	phi = atan(cameraPos.z / cameraPos.x);
}

void generateArray() {
	char* off;
	off = textFileRead("..\\mesh-data\\bunny.off");
	std::vector<std::string> lines;
	std::stringstream sstreamLine(off);
	std::string line;

	while (getline(sstreamLine, line, '\n')) {
		lines.push_back(line);
	}

	std::vector<std::string> vfs;
	std::stringstream sstreamVf(lines[1]);
	std::string vf;

	while (getline(sstreamVf, vf, ' ')) {
		vfs.push_back(vf);
	}

	vertices = stoi(vfs[0]);
	faces = stoi(vfs[1]);

	vertexArray = new float[vertices * 3];
	indexArray = new int[faces * 3];
	std::vector<int> indexVector;

	for (int i = 0; i < vertices; i++) {
		std::stringstream sstreamXyz(lines[i + 2]);
		std::string xyz;
		int j = 0;
		while (getline(sstreamXyz, xyz, ' ')) {
			float pos = stof(xyz);
			vertexArray[i * 3 + j] = pos;
			j++;
		}
	}

	for (int i = 0; i < faces; i++) {
		std::stringstream sstreamIndex(lines[i + 2 + vertices]);
		std::string indices;
		while (getline(sstreamIndex, indices, ' ')) {
			int index = stoi(indices);
			indexVector.push_back(index);
		}
	}

	int cnt = 0;
	for (int i = 0; i < indexVector.size(); i++) {
		if (i % 4 != 0) {
			indexArray[i - cnt] = indexVector[i];
		}
		else
			cnt++;
	}

	std::vector<std::vector<VECTOR3D>> vertexVectorList;
	
	for (int i = 0; i < vertices; i++) {
		std::vector<VECTOR3D> vertexList;
		VECTOR3D vec;
		vec = VECTOR3D(vertexArray[i * 3], vertexArray[i * 3 + 1], vertexArray[i * 3 + 2]);
		vertexList.push_back(vec);
		vertexVectorList.push_back(vertexList);
	}

	for (int i = 0; i < faces; i++) {
		int p, q, r;
		p = indexArray[i * 3];
		q = indexArray[i * 3 + 1];
		r = indexArray[i * 3 + 2];
		VECTOR3D pc, qc, rc;
		pc = vertexVectorList[p][0];
		qc = vertexVectorList[q][0];
		rc = vertexVectorList[r][0];
		VECTOR3D ptoq, ptor;
		ptoq = qc - pc;
		ptor = rc - pc;
		VECTOR3D faceNormal;
		faceNormal = ptoq.CrossProduct(ptor);
		faceNormal.Normalize();
		vertexVectorList[p].push_back(faceNormal);
		vertexVectorList[q].push_back(faceNormal);
		vertexVectorList[r].push_back(faceNormal);
	}

	normalArray = new float[vertices * 3];

	for (int i = 0; i < vertices; i++) {
		VECTOR3D vertexNormal;
		vertexNormal = VECTOR3D();
		for (int j = 1; j < vertexVectorList[i].size(); j++) {
			vertexNormal += vertexVectorList[i][j];
		}
		vertexNormal /= (vertexVectorList[i].size() - 1);
		vertexNormal.Normalize();
		normalArray[i * 3] = vertexNormal.x;
		normalArray[i * 3 + 1] = vertexNormal.y;
		normalArray[i * 3 + 2] = vertexNormal.z;
	}

	vnArray = new float[vertices * 6];

	for (int i = 0; i < vertices; i++) {
		vnArray[i * 6] = vertexArray[i * 3];
		vnArray[i * 6 + 1] = vertexArray[i * 3 + 1];
		vnArray[i * 6 + 2] = vertexArray[i * 3 + 2];
		vnArray[i * 6 + 3] = normalArray[i * 3];
		vnArray[i * 6 + 4] = normalArray[i * 3 + 1];
		vnArray[i * 6 + 5] = normalArray[i * 3 + 2];
	}
}

void bufferManager() {
	glGenVertexArrays(1, &VAO);
 	glGenBuffers(1, &abo);
	glGenBuffers(1, &ebo);

	glBindVertexArray(VAO);
 	glBindBuffer(GL_ARRAY_BUFFER, abo);
 	glBufferData(GL_ARRAY_BUFFER, sizeof(float) * vertices * 6, vnArray, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ebo);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(int) * faces * 3, indexArray, GL_STATIC_DRAW);

	glEnableVertexAttribArray(0);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void*)0);

	glEnableVertexAttribArray(1);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 6, (void*)(sizeof(float) * 3));

	glBindVertexArray(0);
 }

void reshape(int w, int h)
{
	glLoadIdentity();
	glViewport(0, 0, w, h);
	glOrtho(-0.5, 0.5, -0.5, 0.5, 5, 20);

	width = w;
	height = h;
}

void keyboard(unsigned char key, int x, int y)
{
	//if(key == 'p') {
	//	// ToDo
	//}
	
	int alphaLocation = glGetUniformLocation(p, "alpha");
	int dLocation = glGetUniformLocation(p, "k_d");
	int aLocation = glGetUniformLocation(p, "k_a");
	int sLocation = glGetUniformLocation(p, "k_s");
	glUseProgram(p);

	switch (key) {
	case 'o':
		isO = true;
		isP = false;

		glMatrixMode(GL_PROJECTION);
		glLoadIdentity();
		glOrtho(-1, 1, -1, 1, -50, 50);

		glMatrixMode(GL_MODELVIEW);
		glLoadIdentity();

		std::cout << "Orthogonal Projection" << std::endl;
		break;
	case 'p':
		isO = false;
		isP = true;

		glMatrixMode(GL_PROJECTION);
		glLoadIdentity();
		//gluPerspective(45, (float)width / height, 0.1, 500);
		glFrustum(-0.1, 0.1, -0.1, 0.1, 3, 20);

		glMatrixMode(GL_MODELVIEW);
		glLoadIdentity();

		std::cout << "Perspective Projection" << std::endl;
		break;
	case '1':
		if (mat_diffuse[0] >= 0.1 && mat_diffuse[1] >= 0.1 && mat_diffuse[2] >= 0.1) {
			mat_diffuse[0] -= 0.1f;
			mat_diffuse[1] -= 0.1f;
			mat_diffuse[2] -= 0.1f;
		}
		else {
			mat_diffuse[0] = 0.0f;
			mat_diffuse[1] = 0.0f;
			mat_diffuse[2] = 0.0f;
		}
		glUniform4f(dLocation, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], mat_diffuse[3]);
		std::cout << "diffuse: " << mat_diffuse[0] << std::endl;
		break;
	case '3':
		if (mat_diffuse[0] < 1 && mat_diffuse[1] < 1 && mat_diffuse[2] < 1) {
			mat_diffuse[0] += 0.1f;
			mat_diffuse[1] += 0.1f;
			mat_diffuse[2] += 0.1f;
		}
		glUniform4f(dLocation, mat_diffuse[0], mat_diffuse[1], mat_diffuse[2], mat_diffuse[3]);
		std::cout << "diffuse: " << mat_diffuse[0] << std::endl;
		break;
	case '4':
		if (mat_ambient[0] >= 0.1 && mat_ambient[1] >= 0.1 && mat_ambient[2] >= 0.1) {
			mat_ambient[0] -= 0.1f;
			mat_ambient[1] -= 0.1f;
			mat_ambient[2] -= 0.1f;
		}
		else {
			mat_ambient[0] = 0.0f;
			mat_ambient[1] = 0.0f;
			mat_ambient[2] = 0.0f;
		}
		glUniform4f(aLocation, mat_ambient[0], mat_ambient[1], mat_ambient[2], mat_ambient[3]);
		std::cout << "ambient: " << mat_ambient[0] << std::endl;
		break;
	case '6':
		if (mat_ambient[0] < 1 && mat_ambient[1] < 1 && mat_ambient[2] < 1) {
			mat_ambient[0] += 0.1f;
			mat_ambient[1] += 0.1f;
			mat_ambient[2] += 0.1f;
		}
		glUniform4f(aLocation, mat_ambient[0], mat_ambient[1], mat_ambient[2], mat_ambient[3]);
		std::cout << "ambient: " << mat_ambient[0] << std::endl;
		break;
	case '7':
		if (mat_specular[0] >= 0.1 && mat_specular[1] >= 0.1 && mat_specular[2] >= 0.1) {
			mat_specular[0] -= 0.1f;
			mat_specular[1] -= 0.1f;
			mat_specular[2] -= 0.1f;
		}
		else {
			mat_specular[0] = 0.0f;
			mat_specular[1] = 0.0f;
			mat_specular[2] = 0.0f;
		}
		glUniform4f(sLocation, mat_specular[0], mat_specular[1], mat_specular[2], mat_specular[3]);
		std::cout << "specular: " << mat_specular[0] << std::endl;
		break;
	case '9':
		if (mat_specular[0] < 1 && mat_specular[1] < 1 && mat_specular[2] < 1) {
			mat_specular[0] += 0.1f;
			mat_specular[1] += 0.1f;
			mat_specular[2] += 0.1f;
		}
		glUniform4f(sLocation, mat_specular[0], mat_specular[1], mat_specular[2], mat_specular[3]);
		std::cout << "specular: " << mat_specular[0] << std::endl;
		break;
	case '-':
		if (alpha > 0) {
			alpha--;
		}
		glUniform1ui(alphaLocation, alpha);
		std::cout << "alpha: " << alpha << std::endl;
		break;
	case '+':
		alpha++;
		glUniform1ui(alphaLocation, alpha);
		std::cout << "alpha: " << alpha << std::endl;
		break;
	}

	glutPostRedisplay();
}

void processMouse(int button, int state, int x, int y) {

	mousePosX = x;
	mousePosY = y;

	mouseDownPos[0] = mousePosX;
	mouseDownPos[1] = mousePosY;

	switch (button) {
	case GLUT_LEFT_BUTTON:
		if (state == GLUT_DOWN) {
			leftClicked = true;
		}
		else {
			leftClicked = false;
		}
		break;
	case GLUT_MIDDLE_BUTTON:
		if (state == GLUT_DOWN) {
			middleClicked = true;
		}
		else {
			middleClicked = false;
		}
		break;
	case GLUT_RIGHT_BUTTON:
		if (state == GLUT_DOWN) {
			rightClicked = true;
		}
		else {
			rightClicked = false;
		}
		break;
	}
}

void processDragMouse(int x, int y) {

	mousePosX = x;
	mousePosY = y;
	deltaX = mousePosX - mouseDownPos[0];
	deltaY = mousePosY - mouseDownPos[1];

	if (rightClicked) {

		if (isO) {
			scale[0] += deltaX / 10.0f;
			scale[1] += deltaX / 10.0f;
			scale[2] += deltaX / 10.0f;
			std::cout << "Orthogonal Zooming" << std::endl;
		}
		else if (isP) {
			cameraPos.z -= deltaX / 10.0f;
			std::cout << "Perspective Zooming" << std::endl;
		}

		mouseDownPos[0] = mousePosX;
		mouseDownPos[1] = mousePosY;
	}

	if (middleClicked) {
		cameraPos.x += deltaX / 1000.0f;
		cameraPos.y += deltaY / 1000.0f;
		std::cout << "Panning" << std::endl;
	}

	if (leftClicked) {
		float dTheta = deltaY / 5000.0f;
		float dPhi = deltaX / 5000.0f;
		theta -= dTheta;
		phi += dPhi;
		cameraPos.x = radius * sin(theta) * cos(phi);
		cameraPos.y = radius * cos(theta);
		cameraPos.z = radius * sin(theta) * sin(phi);
		std::cout << "Rotation" << std::endl;
	}
}

void renderScene(void) 
{
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	glLoadIdentity();
		
	/*gluLookAt(0.0,0.0,10.0, 
		      0.0,0.0,0.0,
			  0.0f,1.0f,0.0f);*/

	gluLookAt(cameraPos.x, cameraPos.y, cameraPos.z, 
		      cameraTarget.x, cameraTarget.y, cameraTarget.z,
			  up.x, up.y, up.z);

	glScalef(scale[0], scale[1], scale[2]);

	glLightfv(GL_LIGHT0, GL_POSITION, lpos);
	glLightfv(GL_LIGHT1, GL_POSITION, lpos2);
	glLightfv(GL_LIGHT1, GL_AMBIENT, AmbientLightValue);
	glLightfv(GL_LIGHT1, GL_SPECULAR, SpecularLightValue);
	glLightfv(GL_LIGHT1, GL_DIFFUSE, DiffuseLightValue);


	// Draw something here!

	glBindVertexArray(VAO);
	glDrawElements(GL_TRIANGLES, faces * 3, GL_UNSIGNED_INT, 0);
	glBindVertexArray(0);


    glutSwapBuffers();
}

void idle()
{
	glutPostRedisplay();
}

//
// Main
//
int main(int argc, char **argv) 
{
	// init GLUT and create Window
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_DEPTH | GLUT_DOUBLE | GLUT_RGBA);
	glutInitWindowPosition(100,100);
	glutInitWindowSize(800,800);
	glutCreateWindow("AAA633 - Assignment 1");

	// register callbacks
	glutDisplayFunc(renderScene);
	glutIdleFunc(renderScene);
	glutReshapeFunc(reshape);
	glutKeyboardFunc(keyboard);
	glutMouseFunc(processMouse);
	glutMotionFunc(processDragMouse);
	glutIdleFunc(idle);

	glEnable(GL_DEPTH_TEST);
    glClearColor(1.0,1.0,1.0,1.0);

	/*glMaterialfv(GL_FRONT, GL_SPECULAR, mat_specular);
	glMaterialfv(GL_FRONT, GL_DIFFUSE, mat_diffuse);
	glMaterialfv(GL_FRONT, GL_AMBIENT, mat_ambient);*/

	glEnable(GL_LIGHTING);
	glEnable(GL_LIGHT0);
	glEnable(GL_LIGHT1);

	glewInit();
	if (glewIsSupported("GL_VERSION_3_3"))
		printf("Ready for OpenGL 3.3\n");
	else {
		printf("OpenGL 3.3 is not supported\n");
		exit(1);
	}

	generateArray();
	bufferManager();
	cameraSetup();

	// Create shader program
	p = createGLSLProgram( "../phong.vert", NULL, "../phong.frag" ); // Phong

	// enter GLUT event processing cycle
	glutMainLoop();
	
	return 1;
}
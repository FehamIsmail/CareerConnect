<h1>CareerConnect</h1>
<img width="960" alt="image" src="https://user-images.githubusercontent.com/98190195/236369876-06d96afe-65f9-4b5d-af55-d217afa35f1e.png">

Career Connect is a full-stack career services platform that helps students apply to job opportunities and helps employers find new hires. CareerConnect has an aesthetically pleasing, original, and engaging user interface. Its design effectively captures and retains the user's attention. The platform includes features such as email notification, social authentication login (Facebook, Google, GitHub), candidate filtering options, as well as several CRUD functionalities necessary to the website. The project was developed using Django REST framework and React over a 12-week period, consisting of 4 sprints, following an Agile methodology.

<h2>Target audience</h2>
This platform is designed for students who are looking for jobs or internships, as well as for employers who are looking to contribute to the development of the next generation.

<h2>Features</h2>
<li>Students can apply to job opportunities by uploading their application package.</li>
<li>Employers can post jobs, edit and delete them if needed.</li>
<li>Employers can find top talent by screening the candidates in 3 different phases.</li>
<li>Social authentication login is implemented on the sign-up page to work with Google, Facebook and GitHub.</li>
<li>Filtering options facilitate search experience.</li>
<li>Students receive an email when the status of an application changes from one state to another.</li>


<h2>Contributors</h2>

| Name | GitHub username | Speciality |
| ---- | --------------- | -------- |
| Abdelkader Habel | abdelh17 | Backend |
| Abdul-Hakim Skaik | HakimSkaik | Frontend |
| Ismail Feham | FehamIsmail | Frontend |
| Zakaria El Manar El Bouanani | Trapdoge | Backend |


<h2>Technologies Used:</h2>

- Django REST Framework (Python)
- React TypeScript
  * TailwindCSS 
  * React Router Dom 
  * Axios
  
- CircleCI (CI Pipeline)
- SonarCloud (Static analysis)
  
<h2>Setup</h2>
To run the project locally, follow these steps:

1. Clone the repository: git clone https://github.com/FehamIsmail/-hiza_tech-soen341project2023-.git

2. Run the following commands: 
```
python -m venv env
source env/bin/activate

cd CareerConnect_API
pip install requirements.txt
python manage.py runserver

cd ../frontend
npm install
npm run start
```
A tab with the URL ```localhost:3000``` will automatically open after running ```npm run start```.
 
<h2>Testing and CI</h2>
Unit tests have been written for this platform and are automatically ran in the pipeline using CircleCI when there are Pull Requests.

<h2>Wiki</h2>
More details about the project can be found in the Wiki page of the repo. Meeting minutes, diagrams and user stories are present there.

<h2>User Stories</h2>

![image](https://user-images.githubusercontent.com/98190195/228119686-b21bb0be-dcbd-4123-bd54-58fa8f56e7c5.png)
![image](https://user-images.githubusercontent.com/98190195/228119843-96433fe7-c1fd-4276-a818-30a2cc80f367.png)
![image](https://user-images.githubusercontent.com/98190195/232182409-b86c8564-384e-4349-beea-324674099f92.png)


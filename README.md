# Note

This project is part of a Hackathon, or experimental project with no support or quality guarantee implied.

This model/application is intended for research and development use only. The model/application is not intended for use in clinical diagnosis or clinical decision-making or for any other clinical use and the performance of the model/application for clinical use has not been established

# Getting Started

### Installing Python dependencies
Python dependencies are listed in the *requirements.txt* file. Install them via:

- Navigate to the root folder
- Create a Python Virtual Environment
```
    python -m venv venv
    source ./venv/bin/activate (MacOS)
    venv\Scripts\activate.bat (Windows)

    pip install -r backend/requirements.txt
```

### Installing React dependencies
- Navigate to the *frontend* folder
- Run:
```
    npm install @chakra-ui/react@2.0.2
    npm install @emotion/react@11.9.0 @emotion/styled@11.8.1 emotion-theming@11.0.0
```


### Running the Backend (FastAPI)
Navigate to the root folder: `python backend/main.py`

### Running the Frontend (React)
Navigate to the frontend folder: `npm run start`
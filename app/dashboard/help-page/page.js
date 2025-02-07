export default function HelpPage(){
    return (
        <div>
    <h1 className="text-3xl font-bold ml-5">Instructions</h1>
    <div className="mt-5 ml-5">
        <p className="font-semibold text-lg">1. Getting Started</p>
        <ul className="list-disc ml-5">
            <li>Create an Account with your e-mail.</li>
            <li>Log in if you already have an account.</li>
        </ul>
    </div>
    <div className="mt-5 ml-5">
        <p className="font-semibold text-lg">2. Features Overview</p>
        <ul className="list-disc ml-5">
            <li>
                <strong>Dashboard:</strong> The dashboard provides an overview of all your projects and their statuses. You can see an indicator 
                (blue point) for each project to quickly assess progress, but detailed information is not available directly from the dashboard. Click on a project to view more specifics.
            </li>
            <li>
                <strong>Project:</strong> In the Projects section, you can create a new project and access all breakdown details. 
                This includes task assignments, deadlines, and progress tracking, allowing for comprehensive project management.
            </li>
            <li>
                <strong>Analytics:</strong> The Analytics feature offers reports on project performance. You can review metrics such as completion rates, 
                resource allocation, and timelines to evaluate the effectiveness of your project.
            </li>
        </ul>
    </div>
    <div className="mt-5 ml-5">
        <p className="font-semibold text-lg">3. Troubleshooting</p>
        <p className="font-medium mt-2">Common Issues:</p>
        <ul className="list-disc ml-5">
            <li><strong>Login Problems:</strong> Ensure you are using the correct username and password. If you’re locked out, use the password reset feature.</li>
            <li><strong>Data Not Saving:</strong> If changes aren’t saving, check your internet connection and ensure all required fields are filled out.</li>
            <li><strong>Slow Performance:</strong> Clear your browser cache or try a different browser to see if performance improves.</li>
        </ul>
        <p className="font-medium mt-2">Error Messages:</p>
        <ul className="list-disc ml-5">
            <li><strong>Required Fields:</strong> Some areas of the app cannot be left blank. Ensure all required fields are filled before submitting.</li>
            <li><strong>Invalid Input:</strong> If you receive an error about invalid input, double-check the format of your entries (e.g., email addresses, dates).</li>
        </ul>
    </div>
    <div className="mt-5 ml-5">
        <p className="font-semibold text-lg">4. Account Management</p>
        <ul className="list-disc ml-5">
            <li>
                <strong>Updating Your Profile:</strong> To update your profile, click on your icon located at the top right corner of the screen. From the dropdown menu, select "Edit Profile" and make your desired changes. Don’t forget to save!
            </li>
            <li>
                <strong>Password Reset:</strong> If you’ve forgotten your password, click on the "Forgot Password?" link on the login page. Follow the prompts to reset your password via the email associated with your account.
            </li>
        </ul>
    </div>
    <div className="mt-5 ml-5">
        <p className="font-semibold text-lg">5. Contact Us</p>
        <p>Support Email: <a className="text-blue-500 underline">BrickByClick@gmail.com</a></p>
    </div>
</div>
    );
}
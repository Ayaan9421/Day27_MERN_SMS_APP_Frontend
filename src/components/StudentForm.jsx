import { useFormik } from "formik";
import { Card, Form, Button, Alert } from "react-bootstrap";

function StudentForm({ initialValues, isUpdate, onSubmit }) {
        const validate = (values) => {
                const errors = {};
                if (!values.rno && !isUpdate) {
                        errors.rno = "Roll number is required";
                }
                if ((parseFloat(values.rno) < 0) && !isUpdate) {
                        errors.rno = "Roll number should not be negative";
                }
                if (!values.name) {
                        errors.name = "Name is required";
                }
                if (!values.marks && values.marks !== 0) {
                        errors.marks = "Marks are required";
                }
                if (parseFloat(values.marks) < 0) {
                        errors.marks = "Marks cannot be negative";
                }
                if (parseFloat(values.marks) > 100) {
                        errors.marks = "Marks cannot exceed 100";
                }
                return errors;
        };

        const formik = useFormik({
                initialValues,
                validate,
                onSubmit,
                enableReinitialize: true,
        });

        return (
                <Card className="shadow-custom">
                        <Card.Body>
                                <Form onSubmit={formik.handleSubmit}>
                                        {!isUpdate && (
                                                <Form.Group className="mb-3">
                                                        <Form.Label className="d-flex align-items-center">
                                                                <span className="me-2">🔢</span>
                                                                Roll Number
                                                        </Form.Label>
                                                        <Form.Control
                                                                type="number"
                                                                name="rno"
                                                                value={formik.values.rno}
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                isInvalid={formik.touched.rno && formik.errors.rno}
                                                                placeholder="Enter roll number"
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                                {formik.touched.rno && formik.errors.rno}
                                                        </Form.Control.Feedback>
                                                </Form.Group>
                                        )}

                                        <Form.Group className="mb-3">
                                                <Form.Label className="d-flex align-items-center">
                                                        <span className="me-2">👤</span>
                                                        Student Name
                                                </Form.Label>
                                                <Form.Control
                                                        type="text"
                                                        name="name"
                                                        value={formik.values.name}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        isInvalid={formik.touched.name && formik.errors.name}
                                                        placeholder="Enter student name"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                        {formik.touched.name && formik.errors.name}
                                                </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                                <Form.Label className="d-flex align-items-center">
                                                        <span className="me-2">📊</span>
                                                        Marks
                                                </Form.Label>
                                                <Form.Control
                                                        type="number"
                                                        name="marks"
                                                        value={formik.values.marks}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        isInvalid={formik.touched.marks && formik.errors.marks}
                                                        placeholder="Enter marks (0-100)"
                                                        min="0"
                                                        max="100"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                        {formik.touched.marks && formik.errors.marks}
                                                </Form.Control.Feedback>
                                                <Form.Text className="text-muted">
                                                        Enter marks between 0 and 100
                                                </Form.Text>
                                        </Form.Group>

                                        {isUpdate && (
                                                <Alert variant="info" className="mb-3">
                                                        <Alert.Heading className="h6">
                                                                <span className="me-2">ℹ️</span>
                                                                Update Mode
                                                        </Alert.Heading>
                                                        You are updating the student record. Roll number cannot be changed.
                                                </Alert>
                                        )}

                                        <div className="d-grid gap-2">
                                                <Button
                                                        type="submit"
                                                        variant="primary"
                                                        size="lg"
                                                        disabled={formik.isSubmitting}
                                                >
                                                        {formik.isSubmitting ? (
                                                                <>
                                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                        {isUpdate ? "Updating..." : "Creating..."}
                                                                </>
                                                        ) : (
                                                                <>
                                                                        {isUpdate ? "Update Student" : "Create Student"}
                                                                </>
                                                        )}
                                                </Button>
                                        </div>
                                </Form>
                        </Card.Body>
                </Card>
        );
}

export default StudentForm;
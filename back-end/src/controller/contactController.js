import * as contactService from '../service/contactService';

export const createContact = async (req, res) => {
  try {
    const { fullName, problem, phone, email, content } = req.body;
    if (!fullName || !problem || !phone || !email || !content) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const response = await contactService.createContactService(fullName, problem, phone, email, content);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

export const feedbackContact = async (req, res) => {
  try {
    const id = req.params.id;
    const feedback = req.body.feedback;
    const headersToken = req.headers.token;
    if (!id || !feedback || !headersToken) {
      return res.status(400).json({
        status: 'ERROR',
        msg: 'Full information is required',
      });
    }
    const token = headersToken?.split(' ')[1];
    const response = await contactService.feedbackContactService(feedback, id, token);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      err: -1,
      msg: 'failure ' + error,
    });
  }
};

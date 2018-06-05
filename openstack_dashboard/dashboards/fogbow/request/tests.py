from horizon.test import helpers as test


class RequestTests(test.TestCase):
    # Unit tests for request.
    def test_me(self):
        self.assertTrue(1 + 1 == 2)

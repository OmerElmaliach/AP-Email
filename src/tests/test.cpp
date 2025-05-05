#include <gtest/gtest.h>
#include "app.h"


TEST(AppTest, test) {
    EXPECT_EQ("test", "test");
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
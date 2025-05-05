#include <gtest/gtest.h>
#include <vector>
#include "/tmp/code.cpp"  // Inclui a função a ser testada

TEST(CriaVetorTest, RetornaVetorCom10Elementos) {
    std::vector<int> v = criaVetor();
    EXPECT_EQ(v.size(), 10);
}

TEST(CriaVetorTest, NaoVazio) {
    std::vector<int> v = criaVetor();
    EXPECT_FALSE(v.empty());
}
